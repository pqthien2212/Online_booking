module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "\\.(css|less)$": "jest-css-modules-transform",
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
    "@mui/x-charts/LineChart": "<rootDir>/node_modules/@mui/x-charts/LineChart",
    "@mui/x-charts": "<rootDir>/node_modules/@mui/x-charts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(\\@mui/x-charts|d3-shape|d3-path|d3-scale|d3-array|internmap|d3-interpolate|d3-color|d3-format|d3-time|d3-time-format|d3-delaunay|delaunator|robust-predicates|swiper)/)",
    "dist",
  ],
  verbose: true,
  bail: true,
};
