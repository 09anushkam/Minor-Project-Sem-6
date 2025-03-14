import { useState } from "react";
import ScrapeForm from "./components/ScrapeForm";
import ScrapeResults from "./components/ScrapeResults";

function Testing() {
  const [results, setResults] = useState(null);
  console.log("Scraped results are: ", results);

  return (
    <div>
      <h1>Social Media Data Scraper</h1>
      <ScrapeForm setResults={setResults} />
      {results && <ScrapeResults results={results} />}
    </div>
  );
}

export default Testing;
