import { clientLoader } from "#app/routes/_index";
import { useLoaderData } from "@remix-run/react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { Datum } from "./model";

const config = {
  width: 400,
  height: 100,

  margin: {
    top: 10,
    right: 30,
    bottom: 20,
    left: 55,
  },
};

const transactionsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function ChartOne() {
  const { dataOne: data } = useLoaderData<typeof clientLoader>();

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, config.width, config.height]);
    svg.selectAll("*").remove();

    // --- Axis ---

    const xScale = d3.scaleUtc(
      d3.extent(data, (d) => d.timestamp) as [number, number],
      [config.margin.left, config.width - config.margin.right],
    );
    const yScale = d3.scaleLinear(
      d3.extent(data, (d) => d.transactions).reverse() as [number, number],
      [config.margin.top, config.height - config.margin.bottom],
    );

    const xFormatter = d3.utcFormat("%B %d");
    const yFormatter = d3.formatPrefix(".0", 1000);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain())
      .tickSizeInner(0)
      .tickPadding(10)
      // @ts-expect-error type is wrong, works
      .tickFormat(xFormatter);
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(yScale.domain())
      .tickSizeInner(0)
      .tickPadding(25)
      .tickFormat(yFormatter);

    const axes = svg
      .append("g")
      .attr("class", "axes")
      .attr("class", "text-[11px]");

    axes
      .append("g")
      .attr("transform", `translate(${config.margin.left},0)`)
      .call(yAxis)
      .attr("font-size", null)
      .attr("class", "fill-muted-foreground")
      .call((g) => g.select(".domain").remove());

    axes
      .append("g")
      .attr("transform", `translate(0,${config.height - config.margin.bottom})`)
      .call(xAxis, -1) // second arg does nothing but required by type
      .attr("font-size", null)
      .attr("class", "fill-muted-foreground")
      .call((g) => g.select(".domain").remove());

    axes.selectAll("text").attr("fill", null);

    // Line

    const lineGroup = svg
      .append("g")
      .attr("pointer-events", "bounding-box")
      .on("pointerenter pointermove", pointermove)
      .on("pointerleave", pointerleave);

    function pointermove(event: PointerEvent) {
      // get according datum
      const i = bisect(data, xScale.invert(d3.pointer(event)[0]));
      const datum = data[i]!;

      markerIn(datum);
      tooltipIn(datum);
    }

    function pointerleave() {
      markerOut();
      tooltipOut();
    }

    const line = d3
      .line<Datum>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.transactions))
      .curve(d3.curveCatmullRom.alpha(0.5));

    lineGroup
      .append("path")
      .attr("d", line(data))
      .attr("fill", "none")
      .attr("class", "stroke-foreground stroke-[.5px]");

    // Marker

    const marker = lineGroup
      .append("circle")
      .attr("r", 4)
      .attr("class", "fill-foreground/25");

    const bisect = d3.bisector<Datum, unknown>((d) => d.timestamp).center;

    function markerIn(datum: Datum) {
      // get position
      const x = xScale(datum.timestamp);
      const y = yScale(datum.transactions);

      marker.attr("transform", `translate(${x},${y})`);

      // show the marker
      marker.style("display", null);
    }

    function markerOut() {
      // hide the marker
      marker.style("display", "none");
    }

    // --- Tooltip

    const tooltip = svg.append("g").attr("class", "tooltip-group");

    const tooltipBox = tooltip
      .append("rect")
      .attr("class", "tooltip-box")
      .attr("class", "fill-muted/80")
      .attr("pointer-events", "none");

    const tooltipText = tooltip
      .append("text")
      .attr("class", "tooltip-text")
      .attr("pointer-events", "none");

    function tooltipIn(datum: Datum) {
      tooltipText.selectAll("tspan").remove();

      const time = tooltipText.append("tspan").attr("x", 0);
      time
        .text(d3.utcFormat("%A, %B %d, %Y")(new Date(datum.timestamp)))
        .attr("class", "fill-muted-foreground text-[10px]");

      const transactionsAndPrice = tooltipText
        .append("tspan")
        .attr("class", "text-xs");

      const transactions = transactionsAndPrice
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1em");

      const price = transactionsAndPrice
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "2em");

      transactions.append("tspan").text("Transactions: ");
      transactions
        .append("tspan")
        .text(transactionsFormatter.format(datum.transactions))
        .attr("class", "font-bold");

      price.text(`Price: ${priceFormatter.format(datum.price)}`);

      // position the tooltip
      const x = xScale(datum.timestamp);
      const y = d3.mean(yScale.range());
      const bbox = (tooltipText.node() as SVGTextElement).getBBox();

      tooltip.attr("transform", `translate(${x},${y})`);
      if (x - bbox.width > 0) {
        tooltipText.attr("transform", `translate(${-bbox.width - 10},0)`);
        tooltipBox
          .attr("transform", `translate(${-bbox.width - 10},-10)`)
          .attr("width", bbox.width)
          .attr("height", bbox.height);
      } else {
        tooltipText.attr("transform", `translate(10,0)`);
        tooltipBox
          .attr("transform", `translate(10,-10)`)
          .attr("width", bbox.width)
          .attr("height", bbox.height);
      }

      // show tooltip
      tooltip.style("display", null);
      tooltip.style("opacity", 1);
    }

    function tooltipOut() {
      // hide tooltip
      tooltip.style("display", "none");
      tooltip.style("opacity", 0);
    }

    svg.selectAll();
  }, [data]);

  return (
    <div>
      <h2 className="text-xs text-muted-foreground">
        Transactions History in 14 Days
      </h2>
      <svg ref={svgRef} />
    </div>
  );
}
