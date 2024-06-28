# bos-webcam-webcomponent

—> [near-bos-webcomponent](https://github.com/nearbuilders/near-bos-webcomponent) with [react-webcam](https://github.com/mozmorris/react-webcam) installed, deployed to [web4](https://web4.near.page/), in order to provide a sandbox for builders wanting to create decentralized apps with webcam.

Latest version is deployed to [NEARFS](https://github.com/vgrichina/nearfs) to <https://ipfs.web4.near.page/ipfs/bafybeifpmvbjrw6vdzqfybsgdg4cdnl3oxwxnfchq4yi7bhqhxt23yvkyq/>

## Setup & Development

Initialize repo:

```cmd
yarn
```

Start development version:

```cmd
yarn start
```

Production build:

```cmd
yarn prod
```

Serve the production build:

```cmd
yarn serve prod
```

## Attributes

The `near-social-viewer` web component supports several attributes:

* `src`: the src of the widget to render (e.g. `devs.near/widget/default`)
* `code`: raw, valid, stringified widget code to render (e.g. `"return <p>hello world</p>"`)
* `initialprops`: initial properties to be passed to the rendered widget.
* `rpc`: rpc url to use for requests within the VM
* `network`: network to connect to for rpc requests & wallet connection
* `enablehotreload`: option to connect to local web socket server for live redirect map changes

## Configuring VM Custom Elements

Since [NearSocial/VM v2.1.0](https://github.com/NearSocial/VM/blob/master/CHANGELOG.md#210), a gateway can register custom elements where the key is the name of the element, and the value is a function that returns a React component. For example:

```javascript
initNear({
  customElements: {
    Link: (props) => {
      if (!props.to && props.href) {
        props.to = props.href;
        delete props.href;
      }
      if (props.to) {
        props.to = sanitizeUrl(props.to);
      }
      return <Link {...props} />;
    },
  },
});
```

This is a helpful feature for exposing packages and component libraries that otherwise cannot be accessed through an iframe in typical Widget development. It enables developers to provide a sandbox for builders wanting to build with these elements without going through all the setup.

To distribute a specialized near-bos-webcomponent with its own custom elements:

1. Use the [template](https://github.com/new?template_name=near-bos-webcomponent&template_owner=NEARBuilders) to create a new web component
2. Install the necessary packages and add the custom VM element to `initNear` function
3. Build and distribute the resulting `/dist`

Then, the path to this dist can be referenced via the `-g` flag with [bos-workspace](https://github.com/nearbuilders/bos-workspace).

```cmd
bos-workspace dev -g ./path/to/dist
```

This will start a local dev server using the custom gateway, so you may develop your local widgets through it with access to the custom element.

## Running Playwright tests

To be able to run the [playwright](https://playwright.dev) tests, you first need to install the dependencies. You can see how this is done in [.devcontainer/post-create.sh](./.devcontainer/post-create.sh) which is automatically executed when opening this repository in a github codespace.

When the dependencies are set up, you can run the test suite in your terminal:

```bash
yarn test
```

To run tests visually in the playwright UI, you can use the following command:

```bash
yarn test:ui
```

This will open the playwright UI in a browser, where you can run single tests, and also inspect visually.

If you want to use the playwright UI from a github codespace, you can use this command:

```bash
yarn test:ui:codespaces
```

In general it is a good practice, and very helpful for reviewers and users of this project, that all use cases are covered in Playwright tests. Also, when contributing, try to make your tests as simple and clear as possible, so that they serve as examples on how to use the functionality.

## Local Widget Development

There are several strategies for accessing local widget code during development.

### Proxy RPC

The recommended, least invasive strategy is to provide a custom RPC url that proxies requests for widget code. Widget code is stored in the [socialdb](https://github.com/NearSocial/social-db), and so it involves an RPC request to get the stringified code. We can proxy this request to use our local code instead.

You can build a custom proxy server, or [bos-workspace](https://github.com/nearbuilders/bos-workspace) provides a proxy by default and will automatically inject it to the `rpc` attribute if you provide the path to your web component's dist, or a link to it stored on [NEARFS](https://github.com/vgrichina/nearfs). See more in [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway).

### Redirect Map

The NEAR social VM supports a feature called `redirectMap` which allows you to load widgets from other sources than the on chain social db. An example redirect map can look like this:

```json
{"devhub.near/widget/devhub.page.feed": {"code": "return 'hello';"}}
```

The result of applying this redirect map is that the widget `devhub.near/widget/devhub.page.feed` will be replaced by a string that says `hello`.

The `near-social-viewer` web component supports loading a redirect map from the session storage, which is useful when using the viewer for local development or test pipelines.

By setting the session storage key `nearSocialVMredirectMap` to the JSON value of the redirect map, the web component will pass this to the VM Widget config.

You can also use the same mechanism as [near-discovery](https://github.com/near/near-discovery/) where you can load components from a locally hosted [bos-loader](https://github.com/near/bos-loader) by adding the key `flags` to localStorage with the value `{"bosLoaderUrl": "http://127.0.0.1:3030" }`.

### Hot Reload

The above strategies require changes to be reflected either on page reload, or from a fresh rpc request. For faster updates, there is an option to `enablehotreload`, which will try to connect to a web socket server on the same port and use redirectMap with most recent data.

This feature works best when accompanied with [bos-workspace](https://github.com/nearbuilders/bos-workspace), which will automatically inject it to the `enablehotreload` attribute if you provide the path to your web component's dist, or a link to it stored on [NEARFS](https://github.com/vgrichina/nearfs). See more in [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway). It can be disabled with the `--no-hot` flag.


## Publishing libraries to NEARFS

For testing how the library would work when used from CDN, you may publish it to NEARFS.

 ```bash
yarn nearfs:publish-library:create:car
```

Take note of the IPFS address returned by this command, which will be used for finding the published library later. An example of what this looks like is `bafybeicu5ozyhhsd4bpz4keiur6cwexnrzwxla5kaxwhrcu52fkno5q5fa`

```bash
NODE_ENV=mainnet yarn nearfs:publish-library:upload:car youraccount.near
```

After uploading, it normally takes some minutes before the files are visible on NEARFS. When going to the expected URL based on the IPFS address we saw above, we will first see the message `Not found`.

This is an example of the NEARFS url, and you should replace with the IPFS address you received above:

<https://ipfs.web4.near.page/ipfs/bafybeifpmvbjrw6vdzqfybsgdg4cdnl3oxwxnfchq4yi7bhqhxt23yvkyq/>
