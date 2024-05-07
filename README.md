# Wijit-Reveal Web Component

A web component that displays a user-definable element (such as an icon) which reveals some user-defined content when clicked.

Demo: [https://holmesbryant.github.io/wijit-reveal/](https://holmesbryant.github.io/wijit-reveal/)

## Features
- Displays an element (the trigger) which, when clicked, reveals some content.
- Allows you to provide your own graphic or HTML element to use as the trigger. The default trigger is a hamburger menu icon.
- You can hide the trigger altogether and instead toggle the content visibility by adding and removing the "active" attribute.
- The trigger can be above, below, to the left, or to the right of the content.
- The trigger can be centered, left/top aligned, right/bottom aligned or stretched relative to the content.
- You can set the speed at which the content appears or disappears.
- You can change the gap between the trigger and the content.
- You can change the size of the trigger.
- By default, the content automatically hides when you click anywhere outside the component, or if you click on a link inside the component. However, this feature can be turned off.
- Dispatches a custom event (wijitChanged) to the Window when an attribute changes. The event provides a "detail" property which includes the attribute name (detail.attr), old value (detail.old) and new value (detail.new).

## Usage

Add the script tag. Be sure to include `type="module"`.

    <script type="module" src="wijit-reveal.js"></script>

Include the custom element in the body, and add your content.

    <wijit-reveal>
        <menu>
            <li><a href="/foo">Foo</a></li>
            <li><a href="/bar">Bar</a></li>
            <li><a href="/baz">Baz</a></li>
        </menu>
    </wijit-reveal>

## Attributes
- **active** (default: false)
    - Add/remove this attribute to show/hide the content.
    - Acceptable values: [null, ' ', true, 'true', false, 'false'] ( False and "false" are false. All other values are true.)
- **gap** (default: '.5rem')
    - Determines the gap between the trigger and the content.
    - Acceptable values: Any value compatible with the CSS `gap` property.
- **width** (default: '45px')
    - Influences the width of the icon and the minimum height of the content.
    - Acceptable values: Values which use CSS measurements that define explicit units, such as `45px`, `3rem`, `6ch`, `6vh` etc. Percentage measurements and values like `max-content` will probably not produce desirable results.
- **orient** (default: 'row')
    - Determines the positional relationship between the trigger and the content. "column" places the trigger above the content. "column-reverse" places it below the content. "row" places the trigger to the left of the content. "row-reverse" places it to the right.
    - Acceptable values: ['column', 'column-reverse', 'row', 'row-reverse']
- **position** (default: 'start')
    - Provides additional poisitional control. Depending on the rest of the HTML and CSS of your page, some of these options may not have any effect. The general rule of thumb is that if `orient` is "column" or "column-reverse", `position` affects the left-right position of the trigger. If `orient` is "row" or "row-reverse", `position` affects the top-bottom position of the trigger. For example, if `orient` is "column" and `position` is "start", the trigger will be aligned with the left edge of the content (in addition to being placed above it). And if `orient` is row and `position` is "start", the trigger will be aligned with the top edge of the content (as well as being placed to the left of it).
    - Acceptable values: ['center', 'end', 'start', 'stretch']
- **speed** (default: '.5s')
    - Determines the speed at which the show/hide transition happens.
    - Acceptable values: Any value compatible with the CSS `transition-duration` property. In addition, a simple integer or float may be used, in which case it will be interpreted as "seconds".
- **toggle** (default: true)
    - Determines whether the content is hidden when you click somewhere outside of the custom element, or when you click on a link inside the custom element.
    - Acceptable values: [null, ' ', 'true', true, 'false', false] ( False and "false" are false. All other values are true.)

## Slots

- **icon**
    - Use this slot to provide your own element for the trigger.

### Example

    <!-- Using a button as the trigger -->
    <wijit-reveal>
        <button slot="icon">Click Me</button>
        <div>
            Your Content...
        </div>
    </wijit-reveal>

    <!-- Hide the icon but reserve space for it -->
    <wijit-reveal>
        <span slot="icon"></span>
        ...
    </wijit-reveal>

    <!-- Hide the icon altogether -->
    <style>
        wijit-reveal::part(icon) {
            display: none;
        }
    </style>
    <wijit-reveal>
        ...
    </wijit-reveal>

## CSS Custom Properties

This component exposes several custom css properties which affect the behavior of the component. You must set these properties on the wijit-reveal element in your styles.

### Note

These properties have analogs in the available custom attributes. The attribute value usually takes precedence over the css property value.

    /* Example */
    <style>
      wijit-reveal {
        --gap: .5rem;
        --width: 45px;
        --orient: row;
        --position: start;
        --speed: .5s
      }
    </style>

- **--gap** See the "gap" attribute.
- **--width** See the "width" attribute.
- **--orient** See the "orient" attribute.
- **--position** See the "position" attribute.
- **--speed** See the "speed" attribute.

