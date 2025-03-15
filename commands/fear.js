const { botUtilities } = require("../bot");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { getDateString } = require("../utilities");
const cache = require("../cache");

// Function to draw a progress bar for a single data point
const formatIndex = (data) => {
  const value = parseInt(data.value);
  const date = getDateString(data.timestamp, "January 1");
  const classification = data.value_classification;

  // Create emoji based on the classification
  let emoji = "😐";
  if (classification === "Extreme Fear") emoji = "😱";
  else if (classification === "Fear") emoji = "😨";
  else if (classification === "Neutral") emoji = "😐";
  else if (classification === "Greed") emoji = "😏";
  else if (classification === "Extreme Greed") emoji = "🤑";

  return `${date} → <b>${value}</b> (${classification}) ${emoji}\n`;
};

// Function to generate a chart image
const generateChart = async (data) => {
  // Reverse the data to show oldest to newest (left to right)
  const chartData = [...data].reverse();
  const maxValue = Math.round(
    Math.max(...chartData.map((item) => parseInt(item.value))) * 1.1
  );
  const stepSize = Math.round(maxValue / 5);

  // Extract values and dates
  const values = chartData.map((item) => parseInt(item.value));
  const labels = chartData.map((item) =>
    getDateString(item.timestamp, "MM-DD")
  );

  // Create a canvas for the chart
  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white",
  });

  // Define the chart configuration
  const configuration = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Fear & Greed Index",
          data: values,
          fill: true,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return null;
            }
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top
            );
            gradient.addColorStop(0, "rgba(255, 99, 132, 0.2)"); // Red (Fear)
            gradient.addColorStop(0.5, "rgba(255, 205, 86, 0.2)"); // Yellow (Neutral)
            gradient.addColorStop(1, "rgba(75, 192, 192, 0.2)"); // Green (Greed)
            return gradient;
          },
          borderColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return null;
            }
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top
            );
            gradient.addColorStop(0, "rgb(255, 99, 132)"); // Red (Fear)
            gradient.addColorStop(0.5, "rgb(255, 205, 86)"); // Yellow (Neutral)
            gradient.addColorStop(1, "rgb(75, 192, 192)"); // Green (Greed)
            return gradient;
          },
          borderWidth: 2,
          pointBackgroundColor: values.map((value) => {
            if (value <= 25) return "rgb(255, 99, 132)"; // Extreme Fear
            if (value <= 40) return "rgb(255, 159, 64)"; // Fear
            if (value <= 60) return "rgb(255, 205, 86)"; // Neutral
            if (value <= 75) return "rgb(75, 192, 192)"; // Greed
            return "rgb(54, 162, 235)"; // Extreme Greed
          }),
          pointRadius: 5,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Crypto Fear & Greed Index History",
          font: {
            size: 18,
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        legend: {
          display: true,
          labels: {
            padding: 15,
          },
        },
        tooltip: {
          padding: 12,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: maxValue,
          ticks: {
            stepSize: stepSize,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            padding: 10,
          },
        },
      },
    },
  };

  // Generate the chart image
  const image = await chartJSNodeCanvas.renderToBuffer(configuration);

  // Save the image to a file
  const imagePath = path.join(__dirname, "..", "fear_chart.png");
  fs.writeFileSync(imagePath, image);

  return imagePath;
};

const execute = async (msg, args, edit = {}) => {
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;

  try {
    if (Date.now() - cache.fearChart.generated < 5 * 60 * 1000) {
      botUtilities.sendPhoto(chatId, "./fear_chart.png", {
        caption: `${cache.fearChart.text}`,
        parse_mode: "HTML",
      });
      return;
    }

    // Fetch the Fear & Greed Index data with more historical data
    const response = await axios.get(
      "https://api.alternative.me/fng/?limit=30"
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      // Format the message with HTML
      let message = `<b>Fear & Greed Index Chart (Last 30 days)</b>\n\nHistorical Data (Last 7 days):\n`;

      // Show the last 7 days in text format
      const lastWeekData = response.data.data.slice(0, 7);
      lastWeekData.forEach((data) => {
        message += formatIndex(data);
      });

      // Generate chart image
      const chartPath = await generateChart(response.data.data);

      // Then send the chart
      botUtilities.sendPhoto(chatId, fs.createReadStream(chartPath), {
        caption: `${message}`,
        parse_mode: "HTML",
      });

      cache.fearChart.generated = Date.now();
      cache.fearChart.text = message;
    } else {
      throw new Error("Invalid response format from Fear & Greed API");
    }
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    const errorMessage =
      "Sorry, I couldn't fetch the Fear & Greed Index at the moment. Please try again later.";

    if (edit.msgId) {
      botUtilities.editMessage(chatId, edit.msgId, errorMessage);
    } else {
      botUtilities.sendMessage(chatId, errorMessage);
    }
  }
};

const command = {
  execute,
};

module.exports.command = command;
