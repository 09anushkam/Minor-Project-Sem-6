import { useState } from "react";
import ScrapeForm1 from "./components/scrapeForm1";
import ScrapeForm from "./components/ScrapeForm";
import ScrapeResults from "./components/ScrapeResults";

function Testing() {
  const [results, setResults] = useState(null);
  console.log("Scraped results are: ", results);

  return (
    <div>
      <h1>Social Media Data Scraper</h1>
      {/* <ScrapeForm setResults={setResults} /> */}
      {/* {results && <ScrapeResults results={results} />} */}

      <ScrapeForm1 />
    </div>
  );
}

export default Testing;
