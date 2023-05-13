const fs = require("fs");
const path = require("path");
const resemble = require("resemblejs");

const screenshotPath = "./screenshots";
const resultsPath = "./visual-regression-results";
const oldVersion = "3.41.1";
const newVersion = "4.40.0";

if (!fs.existsSync(resultsPath)) {
  fs.mkdirSync(resultsPath, { recursive: true });
}

function getAllFilePaths(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFilePaths(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const oldVersionFiles = getAllFilePaths(path.join(screenshotPath, oldVersion));
const newVersionFiles = getAllFilePaths(path.join(screenshotPath, newVersion));

const commonFiles = oldVersionFiles.filter((filePath) => {
  const relativeFilePath = path.relative(path.join(screenshotPath, oldVersion), filePath);
  return newVersionFiles.includes(path.join(screenshotPath, newVersion, relativeFilePath));
});

const report = [];

commonFiles.forEach((oldFilePath, index) => {
  const relativeFilePath = path.relative(path.join(screenshotPath, oldVersion), oldFilePath);
  const newFilePath = path.join(screenshotPath, newVersion, relativeFilePath);

  resemble(oldFilePath)
    .compareTo(newFilePath)
    .ignoreColors()
    .onComplete(function (data) {
      const resultImageFilePath = path.join(resultsPath, `comparison_${index}.png`);
      fs.writeFileSync(resultImageFilePath, data.getBuffer());

      report.push({
        oldVersionPath: oldFilePath,
        newVersionPath: newFilePath,
        resultImagePath: resultImageFilePath,
        misMatchPercentage: data.misMatchPercentage,
      });

      const htmlReport = `
<html>
  <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
  </head>
  <body class="bg-secondary">
    <div class="container-fluid">
      ${report
        .map((item) => {
          let color, text;
          if (item.misMatchPercentage < 10) {
            color = "success";
            text = "text-white";
          } else if (item.misMatchPercentage < 30) {
            color = "warning";
            text = "text-dark";
          } else {
            color = "danger";
            text = "text-white";
          }

          const testName = path.basename(item.oldVersionPath, path.extname(item.oldVersionPath));
          const directoryPath = path.dirname(item.oldVersionPath);
          const featureName = path.basename(directoryPath);

          return `
          <div class="card mb-3">
            <div class="card-header text-${text} bg-${color}"></div>
            <div class="card-body">
              <h5 class="card-title">Comparison Report - ${featureName} - ${testName}</h5>
              <p class="card-text">
                Mismatch Percentage: ${item.misMatchPercentage}%
              </p>
              <div class="row">
                <div class="col-md-4">
                  <h6>Old Version</h6>
                  <img src="../${item.oldVersionPath}" class="img-fluid">
                </div>
                <div class="col-md-4">
                  <h6>New Version</h6>
                  <img src="../${item.newVersionPath}" class="img-fluid">
                </div>
                <div class="col-md-4">
                  <h6>Comparison Result</h6>
                  <img src="../${item.resultImagePath}" class="img-fluid">
                </div>
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  </body>
</html>
`;

      fs.writeFileSync(path.join(resultsPath, "report.html"), htmlReport);
    });
});
