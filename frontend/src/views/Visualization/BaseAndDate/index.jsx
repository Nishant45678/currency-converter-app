import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../../../components";
import "./index.css";
import {toast} from "react-toastify"

import { select} from "d3-selection";
import { zoom } from "d3-zoom";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { max } from "d3-array";

const BaseAndDate = () => {
  const [message,setMessage] = useState({type:"",text:''})
  const [isLoading,setLoading]=useState(false)
  const [searchParams] = useSearchParams();
  const currency = searchParams.get("currency");
  const date = searchParams.get("date");
  const svgRef = useRef();
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currency) {
      setMessage({type:'error',text:'Base currency is required for analysis'})
      navigate("/visualization");
      return;
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.post(
          `/api/historical/current`,{
            currency,
            date
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
  }, [currency,date, navigate]);

  useEffect(()=>{
    if(!message.type) return;
    else if(message.type === 'error'){
      toast.error(message.text)
      setMessage({type:'',text:''})
    }
    else if(message.type === 'success'){
      toast.success(message.text)
      setMessage({type:'',text:''})
    }
  },[message])

  const width = 950;
  const height = 400;

  useEffect(() => {
    if (!data) return;
    const margin = { top: 40, right: 50, bottom: 20, left: 50 };
    const tooltip = select("#tooltip");

    const pairData = Object.entries(data.rates).sort((a, b) => b[1] - a[1]);

    const svg = select(svgRef.current)
      .attr("id", "svg__base-and-date")
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const yScale = scaleBand()
      .domain(pairData.map((d) => d[0]))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(axisLeft(yScale));

    const xScale = scaleLinear()
      .domain([0, max(Object.values(data.rates))])
      .range([margin.left, width - margin.right]);

    const xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(xScale));

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);

    const scatter = svg.append("g").attr("clip-path", "url(#clip)");

    scatter
      .selectAll(".bar")
      .data(pairData)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d[0]))
      .attr("height", yScale.bandwidth())
      .attr("x", xScale(0))
      .attr("width", 0)
      .attr("fill", "steelblue")
      .attr("data-base", (d) => d[0])
      .attr("data-currency", (d) => d[1])
      .on("mouseover", () => {
        tooltip.transition().duration(200).style("opacity", 1);
      })
      .on("mousemove", (e, d) => {
        tooltip.style("top", `${e.pageY + 10}px`);
        tooltip.style("left", `${e.pageX + 10}px`);
        tooltip.html(`
    <p>1 ${data.base} = ${d[1]} ${d[0]}</p>
    `);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", "0");
      })
      .transition()
      .duration(1000)
      .attr("width", (d) => xScale(d[1]) - xScale(0));

    scatter
      .selectAll(".currencyValues")
      .data(pairData)
      .join("text")
      .attr("class", "currencyValues")
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d[0]) + 5)
      .attr("font-size", "0.7rem")
      .attr("dominant-baseline", "middle")
      .text((d) => d[1])
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d[1]) + 2);

    svg
      .append("g")
      .append("text")
      .attr("class", "title")
      .attr("transform", `translate(${width / 2},${margin.top - 10})`)
      .attr("text-anchor", "middle")
      .attr("font-weight", "600")
      .attr("font-size", "1.2rem")
      .text(
        `Exchange rates relatives to ${data.base} on ${new Date(
          data.date
        ).toDateString()}`
      );

    const handleZoom = (e) => {
      const newX = e.transform.rescaleX(xScale);
      xAxis.call(axisBottom(newX));
      scatter.selectAll(".bar").attr("width", (d) => newX(d[1]) - newX(0));
      scatter
        .selectAll(".currencyValues")
        .attr("x", (d) => newX(d[1]) - newX(0) + 60);
    };

    const zoomed = zoom()
      .scaleExtent([0.5, 100])
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on("zoom", handleZoom);

    svg.call(zoomed);

    return () => {
      svg.on(".zoom", null);
    };
  }, [data]);

  return (
    <div className="container">
      <Card maxWidth={width}>
        <svg ref={svgRef}></svg>
        <div className="tooltip" id="tooltip"></div>
      </Card>
    </div>
  );
};

export default BaseAndDate;
