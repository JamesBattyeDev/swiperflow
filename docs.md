# SwiperFlow Documentation

SwiperFlow is a powerful, attribute-based wrapper for Swiper.js designed to work seamlessly with Webflow (and any other HTML-based workflow). It allows you to configure advanced slider functionality entirely through HTML data attributes — no JavaScript configuration required.

## How It Works

SwiperFlow uses a simple attribute-based system that lets you configure Swiper sliders declaratively:

1. **Add structure attributes** to your HTML elements to identify the slider components
2. **Add configuration attributes** to the **list element** to customize behavior
3. **Let SwiperFlow handle the rest** — it automatically initializes and configures Swiper based on your attributes

All configuration attributes are read from the **list element** (`data-swf-element="list"`), unless stated otherwise.

### Basic Structure

Every SwiperFlow slider requires these core elements:

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list">
      <div data-swf-element="item">Slide 1</div>
      <div data-swf-element="item">Slide 2</div>
      <div data-swf-element="item">Slide 3</div>
    </div>
  </div>
</div>
```

**Element Roles:**

- `data-swf-component` — Main container that identifies this as a SwiperFlow slider. Accepts an optional value (e.g. `data-swf-component="gallery"`) that names the slider for use with the [JS API](#javascript-api).
- `data-swf-element="wrapper"` — Wrapper element (required by Swiper; the overflow container).
- `data-swf-element="list"` — The slides container. **All configuration attributes go on this element.**
- `data-swf-element="item"` — Individual slide items.

> **Note on CSS classes:** SwiperFlow derives Swiper's `wrapperClass` from the first CSS class on your `list` element (falling back to `swiper-wrapper`), and `slideClass` from the first CSS class on your first `item` (falling back to `swiper-slide`). Style your elements with classes as you normally would and they'll be picked up automatically.

### Adding Navigation & Pagination

Navigation arrows and pagination are optional. Include the relevant elements and SwiperFlow wires them up automatically.

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list">
      <!-- Slides here -->
    </div>
  </div>

  <!-- Optional Navigation: requires both prev and next arrows -->
  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">←</div>
    <div data-swf-element="next-arrow">→</div>
  </div>

  <!-- Optional Pagination: requires at least one pagination-dot child -->
  <div data-swf-element="pagination">
    <div data-swf-element="pagination-dot"></div>
  </div>
</div>
```

- **Navigation** is only enabled if **both** `prev-arrow` and `next-arrow` elements are present inside `navigation`.
- **Pagination** is only enabled if the `pagination` element contains at least one `pagination-dot` child. The dot's first CSS class becomes Swiper's bullet class, and the active bullet receives the `is-active` class. Bullets are rendered as clickable `<button>` elements.

### Configuring the Slider

Add `data-swf-*` attributes to the **list element** to configure behavior:

```html
<div
  data-swf-element="list"
  data-swf-loop
  data-swf-speed="600"
  data-swf-visible="3"
  data-swf-gap="20"
>
  <div data-swf-element="item">Slide 1</div>
  <div data-swf-element="item">Slide 2</div>
  <div data-swf-element="item">Slide 3</div>
</div>
```

> **Boolean attributes:** Attributes like `data-swf-loop`, `data-swf-autoplay`, `data-swf-centered`, and `data-swf-keyboard` are **presence-based** — add them bare (e.g. `data-swf-loop`), don't use `="true"`. Attributes that default to `true` (such as `data-swf-grab`, `data-swf-swipe`, `data-swf-touch`) are disabled by setting them to `"false"`.

## Complete Attribute Reference

### Basic Configuration

| Attribute               | Swiper Property        | Type          | Default                 | Description                                                        |
| ----------------------- | ---------------------- | ------------- | ----------------------- | ------------------------------------------------------------------ |
| `data-swf-speed`        | `speed`                | number        | `400`                   | Transition speed in milliseconds                                   |
| `data-swf-gap`          | `spaceBetween`         | number        | `0`                     | Space between slides in pixels                                     |
| `data-swf-visible`      | `slidesPerView`        | string/number | `1`                     | Number of slides visible (or `"auto"`)                             |
| `data-swf-loop`         | `loop`                 | boolean       | `false`                 | Enable continuous loop mode (bare attribute)                       |
| `data-swf-initial`      | `initialSlide`         | number        | `0`                     | Index of initial slide (0-based)                                   |
| `data-swf-additional`   | `loopAdditionalSlides` | number        | `0`                     | Additional slides to clone in loop mode                            |
| `data-swf-centered`     | `centeredSlides`       | boolean       | `false`                 | Center the active slide (bare attribute)                           |
| `data-swf-active-class` | `slideActiveClass`     | string        | `"swiper-slide-active"` | CSS class for active slide                                         |
| `data-swf-grab`         | `grabCursor`           | boolean       | `true`                  | Show grab cursor on hover (set to `"false"` to disable)            |
| `data-swf-swipe`        | `allowTouchMove`       | boolean       | `true`                  | Enable touch/swipe interactions (set to `"false"` to disable)      |
| `data-swf-touch`        | `simulateTouch`        | boolean       | `true`                  | Enable mouse drag simulation (set to `"false"` to disable)         |

### Direction

| Attribute            | Swiper Property | Type   | Default        | Valid Values                 | Description     |
| -------------------- | --------------- | ------ | -------------- | ---------------------------- | --------------- |
| `data-swf-direction` | `direction`     | string | `"horizontal"` | `"horizontal"`, `"vertical"` | Slide direction |

### Autoplay

| Attribute                 | Swiper Property    | Type    | Default | Description                              |
| ------------------------- | ------------------ | ------- | ------- | ---------------------------------------- |
| `data-swf-autoplay`       | `autoplay.enabled` | boolean | `false` | Enable autoplay (bare attribute)         |
| `data-swf-autoplay-delay` | `autoplay.delay`   | number  | `3000`  | Delay between transitions in milliseconds |

**Example:**

```html
<div data-swf-element="list" data-swf-autoplay data-swf-autoplay-delay="3000"></div>
```

### Effects

| Attribute         | Swiper Property | Type   | Default  | Valid Values                                                   | Description              |
| ----------------- | --------------- | ------ | -------- | -------------------------------------------------------------- | ------------------------ |
| `data-swf-effect` | `effect`        | string | `"none"` | `"fade"`, `"cards"`, `"card"`, `"creative"`, `"creative-flat"` | Visual transition effect |

**Effect Details:**

- **`fade`** — Crossfade transition between slides (`crossFade: true`).
- **`cards`** — 3D card stack effect with rotation and shadows.
- **`card`** — Alias for `cards`.
- **`creative`** — Custom transform effect with vertical offset (`-2rem`).
- **`creative-flat`** — Custom transform effect without vertical offset. **Note:** on viewports below `480px` wide, `creative-flat` automatically falls back to the default (`none`) effect for reliability.

**Example:**

```html
<div data-swf-element="list" data-swf-effect="fade" data-swf-speed="800"></div>
```

### Easing

| Attribute      | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| `data-swf-ease` | CSS transition timing function applied to the list element. Default: `ease-out`.          |

Accepts the keywords `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear`, or a full `cubic-bezier(...)` value. Invalid values fall back to `ease-out`.

**Example:**

```html
<div data-swf-element="list" data-swf-ease="cubic-bezier(0.4, 0, 0.2, 1)"></div>
```

### Keyboard

| Attribute                          | Swiper Property                  | Type    | Default | Description                                            |
| ---------------------------------- | -------------------------------- | ------- | ------- | ------------------------------------------------------ |
| `data-swf-keyboard`                | `keyboard.enabled`               | boolean | `false` | Enable keyboard control (bare attribute)               |
| `data-swf-keyboard-only-in-viewport` | `keyboard.onlyInViewport`      | boolean | `true`  | Only respond to keys when slider is in viewport        |
| `data-swf-keyboard-page-up-down`   | `keyboard.pageUpDown`            | boolean | `true`  | Enable Page Up / Page Down navigation                  |

**Example:**

```html
<div
  data-swf-element="list"
  data-swf-keyboard
  data-swf-keyboard-only-in-viewport="true"
  data-swf-keyboard-page-up-down="false"
></div>
```

### Responsive Breakpoints

Configure slides per view and gap at different screen sizes. SwiperFlow maps these to Swiper breakpoints at `992`, `768`, `480`, and `0`.

**Breakpoint Tiers**

| Tier                | Min Width  | Breakpoint name       |
| ------------------- | ---------- | --------------------- |
| Desktop             | `≥ 992px`  | `desktop`             |
| Tablet              | `768–991px`| `tablet`              |
| Mobile Landscape    | `480–767px`| `mobileLandscape`     |
| Mobile Portrait     | `< 480px`  | `mobilePortrait`      |

**Slides Per View**

| Attribute                      | Swiper Property                    | Type          | Default | Description                        |
| ------------------------------ | ---------------------------------- | ------------- | ------- | ---------------------------------- |
| `data-swf-bp-desktop`          | `breakpoints['992'].slidesPerView` | string/number | `1`     | Slides visible on desktop          |
| `data-swf-bp-tablet`           | `breakpoints['768'].slidesPerView` | string/number | `1`     | Slides visible on tablet           |
| `data-swf-bp-mobile-landscape` | `breakpoints['480'].slidesPerView` | string/number | `1`     | Slides visible on mobile landscape |
| `data-swf-bp-mobile-portrait`  | `breakpoints['0'].slidesPerView`   | string/number | `1`     | Slides visible on mobile portrait  |

**Gap (Space Between)**

| Attribute                      | Swiper Property                    | Type   | Default | Description                        |
| ------------------------------ | ---------------------------------- | ------ | ------- | ---------------------------------- |
| `data-swf-gap-desktop`         | `breakpoints['992'].spaceBetween`  | number | `0`     | Gap between slides on desktop      |
| `data-swf-gap-tablet`          | `breakpoints['768'].spaceBetween`  | number | `0`     | Gap between slides on tablet       |
| `data-swf-gap-mobile-landscape`| `breakpoints['480'].spaceBetween`  | number | `0`     | Gap between slides on mobile landscape |
| `data-swf-gap-mobile-portrait` | `breakpoints['0'].spaceBetween`    | number | `0`     | Gap between slides on mobile portrait  |

**Example:**

```html
<div
  data-swf-element="list"
  data-swf-bp-desktop="4"
  data-swf-bp-tablet="2"
  data-swf-bp-mobile-landscape="1"
  data-swf-gap-desktop="24"
  data-swf-gap-tablet="16"
  data-swf-gap-mobile-landscape="12"
  data-swf-gap="20"
></div>
```

> **Note:** `data-swf-gap` sets the base gap. Per-breakpoint gap attributes override it at that breakpoint.

### Conditional Initialization

Control when the slider initializes based on viewport size using `data-swf-init`. The value is matched against the current breakpoint name, and multiple breakpoints can be combined comma-separated.

| Attribute Value                          | Description                                    |
| ---------------------------------------- | ---------------------------------------------- |
| `data-swf-init="desktop"`                | Initialize only on desktop (`≥ 992px`)         |
| `data-swf-init="tablet"`                 | Initialize only on tablet (`768–991px`)        |
| `data-swf-init="mobileLandscape"`        | Initialize only on mobile landscape (`480–767px`) |
| `data-swf-init="mobilePortrait"`         | Initialize only on mobile portrait (`< 480px`) |
| `data-swf-init="desktop,tablet"`         | Initialize on desktop and tablet               |

If `data-swf-init` is omitted, the slider initializes at every breakpoint.

To prevent Swiper from auto-initializing entirely (the Swiper instance is created but not started), add a bare `data-swf-disabled` attribute:

```html
<div data-swf-element="list" data-swf-disabled></div>
```

### Controller / Sync

Link two sliders together so they move in sync using Swiper's Controller module. Add a `data-swf-thumb-id` attribute (with a shared value) to the **list element** of each slider you want to connect:

```html
<!-- Main slider -->
<div data-swf-component="main">
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-thumb-id="gallery">
      <!-- slides -->
    </div>
  </div>
</div>

<!-- Thumbnail slider (synced bidirectionally) -->
<div data-swf-component="thumbs">
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-thumb-id="gallery">
      <!-- slides -->
    </div>
  </div>
</div>
```

Sliders that share the same `data-swf-thumb-id` value are linked bidirectionally — controlling either slider moves the other. The `data-swf-thumb-id` attribute must be placed on the `list` element (a direct child of the `wrapper`).

## JavaScript API

SwiperFlow exposes a global `window.swiperflow` object after `DOMContentLoaded`:

| Property / Method | Type     | Description                                                          |
| ----------------- | -------- | ------------------------------------------------------------------- |
| `sliders`         | array    | All initialized `SwiperInstance` objects.                           |
| `breakpoint`      | string   | The current breakpoint (`desktop` / `tablet` / `mobileLandscape` / `mobilePortrait`). |
| `find(name)`      | function | Returns the `SwiperInstance` whose `data-swf-component` value matches `name`, or `undefined`. |
| `init()`          | function | Manually re-run initialization (destroys and rebuilds all sliders). |
| `on(event, cb)`   | function | Register an event listener (see [Events](#events)).                 |

**Example:**

```js
const gallery = window.swiperflow.find('gallery');
console.log(window.swiperflow.breakpoint);
console.log(window.swiperflow.sliders.length);
```

Each `SwiperInstance` exposes:

- `.component` — the root `data-swf-component` element
- `.config` — the parsed Swiper configuration
- `.getSwiperInstance` — the underlying Swiper instance

### Events

SwiperFlow fires events both through the internal bus (`window.swiperflow.on(...)`) **and** as `window` `CustomEvent`s (so you can use `window.addEventListener('swfLoaded', ...)` too).

| Event                | When it fires                                          | `detail` payload                                      |
| -------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `swfLoaded`          | After sliders are initialized (every init cycle)       | `{ sliders, timestamp }`                              |
| `swfResize`          | After a debounced resize triggers re-initialization    | `{ sliders, timestamp, activeBreakpoint }`            |
| `swfBreakpointChange`| When the active breakpoint changes on resize           | `{ previous, current, width }`                        |

**Example:**

```js
window.swiperflow.on('swfBreakpointChange', ({ previous, current }) => {
  console.log(`Breakpoint changed: ${previous} → ${current}`);
});
```

## Common Examples

### Basic Image Carousel

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-loop data-swf-speed="500">
      <div data-swf-element="item"><img src="image1.jpg" /></div>
      <div data-swf-element="item"><img src="image2.jpg" /></div>
      <div data-swf-element="item"><img src="image3.jpg" /></div>
    </div>
  </div>
  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">Prev</div>
    <div data-swf-element="next-arrow">Next</div>
  </div>
  <div data-swf-element="pagination">
    <div data-swf-element="pagination-dot"></div>
  </div>
</div>
```

### Testimonial Slider with Autoplay

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div
      data-swf-element="list"
      data-swf-autoplay
      data-swf-autoplay-delay="5000"
      data-swf-effect="fade"
      data-swf-loop
    >
      <div data-swf-element="item">Testimonial 1</div>
      <div data-swf-element="item">Testimonial 2</div>
      <div data-swf-element="item">Testimonial 3</div>
    </div>
  </div>
</div>
```

### Responsive Product Grid

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div
      data-swf-element="list"
      data-swf-bp-desktop="4"
      data-swf-bp-tablet="2"
      data-swf-bp-mobile-landscape="1"
      data-swf-gap="24"
      data-swf-loop
    >
      <div data-swf-element="item">Product 1</div>
      <div data-swf-element="item">Product 2</div>
      <div data-swf-element="item">Product 3</div>
      <div data-swf-element="item">Product 4</div>
    </div>
  </div>
  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">←</div>
    <div data-swf-element="next-arrow">→</div>
  </div>
</div>
```

### Mobile Portrait-Only Slider

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-init="mobilePortrait" data-swf-visible="1" data-swf-gap="16">
      <div data-swf-element="item">Item 1</div>
      <div data-swf-element="item">Item 2</div>
      <div data-swf-element="item">Item 3</div>
    </div>
  </div>
</div>
```

### Cards Effect Slider

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-effect="cards" data-swf-loop data-swf-grab>
      <div data-swf-element="item">Card 1</div>
      <div data-swf-element="item">Card 2</div>
      <div data-swf-element="item">Card 3</div>
    </div>
  </div>
</div>
```

## Tips for Webflow Users

1. **Use Custom Attributes** — add `data-swf-component` and `data-swf-element` attributes via Webflow's custom attributes panel.
2. **Style the Elements** — apply your own classes for styling; SwiperFlow reads your first CSS class for the slide/wrapper classes and won't interfere with the rest.
3. **Pagination Styling** — the active pagination dot receives the `is-active` class, which you can style in Webflow.
4. **Navigation Buttons** — style your prev/next arrow elements however you like; they just need the `data-swf-element` attribute.
5. **CMS Integration** — works great with Webflow CMS collections — just add the `data-swf-element="item"` attribute to your collection item.
6. **Conditional Display** — use `data-swf-init` to show static content on desktop and a slider on mobile.

## Browser Support

SwiperFlow inherits browser support from Swiper.js. Modern browsers are fully supported.
