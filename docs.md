# SwiperFlow Documentation

SwiperFlow is a powerful, attribute-based wrapper for Swiper.js designed to work seamlessly with Webflow (and any other HTML-based workflow). It allows you to configure advanced slider functionality entirely through HTML data attributes—no JavaScript configuration required.

## How It Works

SwiperFlow uses a simple attribute-based system that lets you configure Swiper sliders declaratively:

1. **Add structure attributes** to your HTML elements to identify the slider components
2. **Add configuration attributes** to customize the slider behavior
3. **Let SwiperFlow handle the rest** - it automatically initializes and configures Swiper based on your attributes

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

- `data-swf-component` - Main container that identifies this as a SwiperFlow slider
- `data-swf-element="wrapper"` - Wrapper element (required by Swiper). Also accepts: `"wrap"`, `"container"`
- `data-swf-element="list"` - The slides container where you add configuration attributes
- `data-swf-element="item"` - Individual slide items

### Adding Navigation & Pagination

To add navigation arrows and/or pagination, include these optional elements:

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list">
      <!-- Slides here -->
    </div>
  </div>

  <!-- Optional Navigation -->
  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">←</div>
    <div data-swf-element="next-arrow">→</div>
  </div>

  <!-- Optional Pagination -->
  <div data-swf-element="pagination"></div>
</div>
```

### Configuring the Slider

Add `data-swf-*` attributes to the **list element** (`data-swf-element="list"`) to configure behavior:

```html
<div
  data-swf-element="list"
  data-swf-loop="true"
  data-swf-speed="600"
  data-swf-visible="3"
  data-swf-gap="20"
>
  <div data-swf-element="item">Slide 1</div>
  <div data-swf-element="item">Slide 2</div>
  <div data-swf-element="item">Slide 3</div>
</div>
```

## Complete Attribute Reference

### Basic Configuration

| Attribute               | Swiper Property        | Type          | Default                 | Description                             |
| ----------------------- | ---------------------- | ------------- | ----------------------- | --------------------------------------- |
| `data-swf-speed`        | `speed`                | number        | `400`                   | Transition speed in milliseconds        |
| `data-swf-gap`          | `spaceBetween`         | number        | `0`                     | Space between slides in pixels          |
| `data-swf-visible`      | `slidesPerView`        | string/number | `1`                     | Number of slides visible (or `"auto"`)  |
| `data-swf-loop`         | `loop`                 | boolean       | `false`                 | Enable continuous loop mode             |
| `data-swf-initial`      | `initialSlide`         | number        | `0`                     | Index of initial slide (0-based)        |
| `data-swf-additional`   | `loopAdditionalSlides` | number        | `0`                     | Additional slides to clone in loop mode |
| `data-swf-centered`     | `centeredSlides`       | boolean       | `false`                 | Center the active slide                 |
| `data-swf-active-class` | `slideActiveClass`     | string        | `"swiper-slide-active"` | CSS class for active slide              |
| `data-swf-grab`         | `grabCursor`           | boolean       | `true`                  | Show grab cursor on hover               |
| `data-swf-swipe`        | `allowTouchMove`       | boolean       | `true`                  | Enable touch/swipe interactions         |
| `data-swf-touch`        | `simulateTouch`        | boolean       | `true`                  | Enable mouse drag simulation            |

### Direction

| Attribute            | Swiper Property | Type   | Default        | Valid Values                 | Description     |
| -------------------- | --------------- | ------ | -------------- | ---------------------------- | --------------- |
| `data-swf-direction` | `direction`     | string | `"horizontal"` | `"horizontal"`, `"vertical"` | Slide direction |

### Autoplay

| Attribute                 | Swiper Property    | Type    | Default | Description                    |
| ------------------------- | ------------------ | ------- | ------- | ------------------------------ |
| `data-swf-autoplay`       | `autoplay.enabled` | boolean | `false` | Enable autoplay                |
| `data-swf-autoplay-delay` | `autoplay.delay`   | number  | `4000`  | Delay between transitions (ms) |

**Example:**

```html
<div data-swf-element="list" data-swf-autoplay="true" data-swf-autoplay-delay="3000"></div>
```

### Effects

| Attribute         | Swiper Property | Type   | Default  | Valid Values                                                   | Description              |
| ----------------- | --------------- | ------ | -------- | -------------------------------------------------------------- | ------------------------ |
| `data-swf-effect` | `effect`        | string | `"none"` | `"fade"`, `"cards"`, `"card"`, `"creative"`, `"creative-flat"` | Visual transition effect |

**Effect Details:**

- **`fade`** - Crossfade transition between slides
- **`cards`** - 3D card stack effect with rotation
- **`card`** - Alias for cards effect
- **`creative`** - Custom transform effect with vertical offset
- **`creative-flat`** - Custom transform effect without vertical offset

**Example:**

```html
<div data-swf-element="list" data-swf-effect="fade" data-swf-speed="800"></div>
```

### Responsive Breakpoints

Configure different slides per view at different screen sizes:

| Attribute             | Breakpoint  | Swiper Property                    | Type          | Default | Description               |
| --------------------- | ----------- | ---------------------------------- | ------------- | ------- | ------------------------- |
| `data-swf-bp-desktop` | `≥ 992px`   | `breakpoints['991'].slidesPerView` | string/number | `1`     | Slides visible on desktop |
| `data-swf-bp-tablet`  | `569-991px` | `breakpoints['568'].slidesPerView` | string/number | `1`     | Slides visible on tablet  |
| `data-swf-bp-mobile`  | `≥ 320px`   | `breakpoints['320'].slidesPerView` | string/number | `1`     | Slides visible on mobile  |

**Example:**

```html
<div
  data-swf-element="list"
  data-swf-bp-desktop="4"
  data-swf-bp-tablet="2"
  data-swf-bp-mobile="1"
  data-swf-gap="20"
></div>
```

### Conditional Initialization

Control when the slider initializes based on viewport size:

| Attribute Value           | Description                             |
| ------------------------- | --------------------------------------- |
| `data-swf-init="desktop"` | Initialize only on desktop (`> 992px`)  |
| `data-swf-init="tablet"`  | Initialize only on tablet (`569-991px`) |
| `data-swf-init="mobile"`  | Initialize only on mobile (`320-568px`) |
| `data-swf-disabled`       | Prevent initialization entirely         |

**Example:**

```html
<!-- Only enable slider on mobile devices -->
<div data-swf-element="list" data-swf-init="mobile"></div>
```

### Advanced Features

| Attribute                  | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `data-swf-double`          | Duplicates all slides (useful for infinite scroll effects)                |
| `data-swf-double-slides`   | Alias for `data-swf-double` - duplicates all slides                       |
| `data-swf-filter`          | Watches for DOM changes and updates slider automatically                  |

### Controller/Sync

Link two sliders together so they move in sync:

| Attribute                         | Description                             | Applied To   |
| --------------------------------- | --------------------------------------- | ------------ |
| `data-swf-ctrl-role="controller"` | Marks this slider as a controller       | List element |
| `data-swf-ctrl-pair="[value]"`    | Links sliders with matching pair values | List element |
| `data-swf-ctrl-id="[id]"`         | Unique identifier for this controller   | List element |

**Example:**

```html
<!-- Main slider -->
<div
  data-swf-element="list"
  data-swf-ctrl-role="controller"
  data-swf-ctrl-pair="gallery"
  data-swf-ctrl-id="main"
></div>

<!-- Thumbnail slider (synced) -->
<div data-swf-element="list" data-swf-ctrl-pair="gallery" data-swf-ctrl-id="thumbs"></div>
```

## Common Examples

### Basic Image Carousel

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-loop="true" data-swf-speed="500">
      <div data-swf-element="item"><img src="image1.jpg" /></div>
      <div data-swf-element="item"><img src="image2.jpg" /></div>
      <div data-swf-element="item"><img src="image3.jpg" /></div>
    </div>
  </div>
  <div data-swf-element="navigation">
    <div data-swf-element="prev-arrow">Prev</div>
    <div data-swf-element="next-arrow">Next</div>
  </div>
  <div data-swf-element="pagination"></div>
</div>
```

### Testimonial Slider with Autoplay

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div
      data-swf-element="list"
      data-swf-autoplay="true"
      data-swf-autoplay-delay="5000"
      data-swf-effect="fade"
      data-swf-loop="true"
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
      data-swf-bp-mobile="1"
      data-swf-gap="24"
      data-swf-loop="true"
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

### Mobile-Only Slider

```html
<div data-swf-component>
  <div data-swf-element="wrapper">
    <div data-swf-element="list" data-swf-init="mobile" data-swf-visible="1" data-swf-gap="16">
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
    <div data-swf-element="list" data-swf-effect="cards" data-swf-loop="true" data-swf-grab="true">
      <div data-swf-element="item">Card 1</div>
      <div data-swf-element="item">Card 2</div>
      <div data-swf-element="item">Card 3</div>
    </div>
  </div>
</div>
```

## Tips for Webflow Users

1. **Use Combo Classes**: Add `data-swf-component` and `data-swf-element` attributes via the custom attributes panel in Webflow
2. **Style the Elements**: Apply your own classes for styling—SwiperFlow attributes won't interfere
3. **Pagination Styling**: The pagination dots receive the `is-active` class, which you can style in Webflow
4. **Navigation Buttons**: Style your prev/next arrow elements however you like—they just need the `data-swf-element` attribute
5. **CMS Integration**: Works great with Webflow CMS collections—just add the `data-swf-element="item"` attribute to your collection item
6. **Conditional Display**: Use `data-swf-init` to show static content on desktop and a slider on mobile

## Browser Support

SwiperFlow inherits browser support from Swiper.js. Modern browsers are fully supported.

---

**Note**: This documentation covers the core attribute system. For advanced customization, visual examples, and use cases, refer to the full documentation project.
