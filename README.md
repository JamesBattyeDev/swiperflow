# SwiperFlow

SwiperFlow is an attribute-based wrapper around [Swiper.js](https://swiperjs.com/) built for Webflow (and any other HTML-based workflow). It lets you configure fully-featured sliders entirely through `data-swf-*` HTML attributes — no JavaScript configuration required.

Add the script, drop a few attributes onto your elements, and SwiperFlow handles initialization, responsive breakpoints, effects, autoplay, keyboard navigation, controller sync, and more.

## Features

- **Zero-config JS** — everything is driven by `data-swf-*` attributes
- **Webflow-friendly** — works with CMS collection lists and custom attributes
- **Responsive** — per-breakpoint slides-per-view and gap, plus conditional initialization
- **Effects** — fade, cards, and creative transforms
- **Autoplay, keyboard, a11y** — built-in, opt-in via attributes
- **Controller sync** — link two sliders together (e.g. main + thumbnails)
- **JS API** — a `window.swiperflow` global for programmatic access and events
- **Auto re-init on resize** — debounced re-initialization when the viewport changes

## Install

```bash
npm install @jamesbattye-dev/swiperflow
# or
pnpm add @jamesbattye-dev/swiperflow
```

## Quick Start

```html
<!-- 1. Include the script -->
<script defer src="https://unpkg.com/@jamesbattye-dev/swiperflow/dist/index.js"></script>

<!-- 2. Add attributes to your markup -->
<div data-swf-component="gallery">
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-loop data-swf-speed="500" data-swf-visible="3" data-swf-gap="20">
      <div data-swf-element="item">Slide 1</div>
      <div data-swf-element="item">Slide 2</div>
      <div data-swf-element="item">Slide 3</div>
    </div>
  </div>

  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">←</div>
    <div data-swf-element="next-arrow">→</div>
  </div>

  <div data-swf-element="pagination">
    <div data-swf-element="pagination-dot"></div>
  </div>
</div>
```

That's it — SwiperFlow initializes automatically on `DOMContentLoaded`.

## How It Works

1. **Structure** — identify slider components with `data-swf-component` and roles with `data-swf-element`.
2. **Configure** — add `data-swf-*` attributes to the **list** element to customize behavior.
3. **Initialize** — SwiperFlow finds every `[data-swf-component]`, parses its attributes, and spins up Swiper.

### Core Elements

| Attribute                          | Role                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `data-swf-component`               | Main container. Optional value (e.g. `"gallery"`) names the slider for the JS API. |
| `data-swf-element="wrapper"`       | Swiper wrapper (overflow container).                              |
| `data-swf-element="list"`          | Slides container. **All configuration attributes go here.**       |
| `data-swf-element="item"`          | Individual slide.                                                 |
| `data-swf-element="navigation"`    | Optional. Container for prev/next arrows.                         |
| `data-swf-element="prev-arrow"`    | Previous button (inside `navigation`).                            |
| `data-swf-element="next-arrow"`    | Next button (inside `navigation`).                                |
| `data-swf-element="pagination"`    | Optional. Pagination container.                                   |
| `data-swf-element="pagination-dot"`| Required inside `pagination` for pagination to activate.          |

> **CSS classes matter:** SwiperFlow derives Swiper's `wrapperClass` from the first class on your `list` element, and `slideClass` from the first class on your first `item`. Style your elements with classes as usual and they'll be picked up automatically.

## Documentation

Full attribute reference, examples, and the JS API are in [docs.md](./docs.md).

## Development

```bash
pnpm install      # install dependencies
pnpm dev          # build + serve with live reload on :3000
pnpm build        # production build to dist/
pnpm check        # type-check
pnpm test:unit    # unit tests (vitest)
pnpm test         # e2e tests (playwright)
```

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)

## Acknowledgements

SwiperFlow is built on top of the [Swiper](https://swiperjs.com/) library. Huge thanks to the Swiper team.

## Contributors

- James Battye — [jamesbattye.dev](https://jamesbattye.dev/)
