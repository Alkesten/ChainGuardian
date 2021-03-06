const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const packageJson = require("./package.json");

module.exports = {
    devtool: "source-map",
    plugins: [
        // Sentry CLI used for uploading releases
        new SentryWebpackPlugin({
            errorHandler: () => null,
            include: ".",
            ignore: ["node_modules", "webpack.*.config.js", ".eslintrc.js", "/coverage", "/mocks"],
            release: packageJson.version,
        }),
    ]
};
