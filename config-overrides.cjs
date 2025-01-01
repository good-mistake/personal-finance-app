import { override, addWebpackModuleRule } from "customize-cra";

export default override(
  addWebpackModuleRule({
    test: /\.worker\.js$/,
    use: { loader: "worker-loader" },
  })
);
