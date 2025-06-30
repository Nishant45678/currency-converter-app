import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../../../components";
import "./index.css";
import { select} from "d3-selection";
import { scaleTime, scaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { extent } from "d3-array";
import { zoom } from "d3-zoom";
import { line } from "d3-shape";

import { toast } from "react-toastify";

const TrendData = () => {
  const [message,setMessage]= useState({type:'',text:''})
  const [isLoading,setLoading] = useState(false)
  const [searchParams] = useSearchParams();
  const fromCurrency = searchParams.get("base");
  const toCurrency = searchParams.get("symbol");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const svgRef = useRef();
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!fromCurrency || !toCurrency) {
      setMessage({type:'error',text:"Currency pair are required for analysis"})
      navigate("/visualization");
      return;
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.post(
          `/api/historical/trend`,
          {
            fromCurrency,
            toCurrency,
            fromDate,
            toDate,
          }
        );
        setData(res.data);
      } catch (error) {
        setMessage({type:'error',text:error?.response?.data.message})
      }
      finally{
        setLoading(false)
      }

    };
    fetchData();
  }, [fromCurrency, fromDate, toCurrency, toDate, navigate]);

  const width = 950;
  const height = 400;

  useEffect(()=>{
    if(!message.type) return;
    else if(message.type === 'error'){
      toast.error(message.text)
      setMessage({type:'',text:''})
    }else if(message.type === "success"){
      toast.success(message.text)
      setMessage({type:'',text:''})
    }
  },[message])

  useEffect(() => {
    if (!data) return;

    const margin = {
      top: 40,
      right: 20,
      bottom: 30,
      left: 30,
    };

    const rates = Object.entries(data.rates).map(([date, rate]) => ({
      date: new Date(date),
      rate: rate[toCurrency],
    }));

    const svg = select("svg");
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const xScale = scaleTime()
      .domain(extent(rates, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(xScale));

    const yScale = scaleLinear()
      .domain(extent(rates, (d) => d.rate))
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(axisLeft(yScale).tickSize(-(width - margin.left - margin.right)))
      .call((g) => g.select(".domain").remove())
      .call((g) => {
        g.selectAll(".tick line").attr("stroke", "#4682B433");
      });

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);

    svg
      .append("g")
      .append("text")
      .attr("class", "title")
      .attr("transform", `translate(${width / 2},${margin.top - 10})`)
      .attr("text-anchor", "middle")
      .attr("font-weight", "600")
      .attr("font-size", "1.2rem")
      .text(
        `Exchange Rate Trend: ${fromCurrency} to ${toCurrency} ${fromDate} - ${toDate}`
      );

    const scatter = svg.append("g").attr("clip-path", "url(#clip)");

    const svgLine = line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.rate));

    const path = scatter
      .append("path")
      .datum(rates)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", svgLine);

    const handleZoom = (e) => {
      const newX = e.transform.rescaleX(xScale);
      xAxis.call(axisBottom(newX));
      const newLine = line().x((d) => newX(d.date)).y((d) => yScale(d.rate));
      path.attr("d", newLine);
    };

    const zoomed = zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on("zoom", handleZoom);

    svg.call(zoomed);

    return () => {
      svg.on(".zoom", null);
    };
  }, [data,toCurrency,fromCurrency,toDate,fromDate]);

  return (
    <div className="container">
      <Card maxWidth={width}>
        <svg ref={svgRef}></svg>
        <div className="tooltip" id="tooltip"></div>
      </Card>
    </div>
  );
};

export default TrendData;
