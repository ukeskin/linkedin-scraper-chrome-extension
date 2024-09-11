let jobLinks = document.querySelectorAll(".job-card-container__link");
let jobDescriptions = [];
let currentPage = 1;
let totalPages = 22;
let index = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "scrape") {
    scrapeJobs(request.limit);
  }
});

function scrapeJobs(limit) {
  if (index < jobLinks.length && jobDescriptions.length < limit) {
    const jobCard = jobLinks[index].closest(".job-card-container");
    if (jobCard) {
      const jobTitle =
        jobCard.querySelector(".job-card-list__title")?.innerText.trim() ||
        "Title not found";
      const jobCompany =
        jobCard
          .querySelector(".job-card-container__primary-description")
          ?.innerText.trim() || "Company not found";
      const jobLocation =
        jobCard
          .querySelector(".job-card-container__metadata-item")
          ?.innerText.trim() || "Location not found";
      const jobLink = jobLinks[index].href;

      jobDescriptions.push({
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        link: jobLink,
      });

      index++;
      scrapeJobs(limit);
    } else {
      console.error("Job card not found");
      index++;
      scrapeJobs(limit);
    }
  } else if (currentPage < totalPages && jobDescriptions.length < limit) {
    currentPage++;
    goToNextPage();
  } else {
    downloadCSV();
  }
}

function goToNextPage() {
  let nextPageButton = document.querySelector(
    `[aria-label="Page ${currentPage}"]`
  );
  if (nextPageButton) {
    nextPageButton.click();

    setTimeout(() => {
      jobLinks = document.querySelectorAll(".job-card-container__link");
      index = 0;
      scrapeJobs(10);
    }, 2000);
  } else {
    console.log("Next page button not found. Collected data:");
    downloadCSV();
  }
}

function downloadCSV() {
  const csvRows = [];
  csvRows.push("Title,Company,Location,Link");

  for (const job of jobDescriptions) {
    csvRows.push(
      `"${job.title.replace(/"/g, '""')}","${job.company.replace(
        /"/g,
        '""'
      )}","${job.location.replace(/"/g, '""')}","${job.link.replace(
        /"/g,
        '""'
      )}"`
    );
  }

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "job_descriptions.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

scrapeJobs(10);
