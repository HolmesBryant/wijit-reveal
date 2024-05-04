# Wijit-Reveal Web Component

A web component that displays a user-definable element (such as an icon) which reveals another element when clicked.

Demo: [https://holmesbryant.github.io/wijit-reveal/](https://holmesbryant.github.io/wijit-reveal/)

## Features
- Allows you to provide a graphic or HTML element to use as the trigger. The default trigger is a hamburger menu icon.
- You can hide the trigger altogether and instead toggle the content visibility by adding and removing the "active" atribute.
- The icon can be above, below, to the left, or to the right of the content.
- You can set the speed at which the content appears or disappears.
- Automatically adds event listeners to hide the content when you click somewhere outside the custom element, or when you click on a link inside the custom element. This feature can be turned off.

## Usage

Include the script tag in your HTTML page.

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
- **active**
    - Add this attribute to make the content visible. Null, true, '' and 'true' are true. False and 'false' are false.
    - Acceptable values: [null, true, false, '', 'true', 'false']
- **orient**
    - Determines the positional relationship between the trigger and the content. "column" places the trigger above the content. "column-reverse" places it below the content. "row" places the trigger to the left of the content. "row-reverse" places it to the right.
    - Acceptable values: ['column', 'column-reverse', 'row', 'row-reverse']
- **align**
    - Provides additional poisitional control. Depending on the rest of the HTML and CSS of your page, some of these options may not have any effect. The general rule of thumb is that if "orient" is "column" or "column-reverse", "align" affects the left-right position of the trigger. If "orient" is "row" or "row-reverse", "align" affects the top-bottom position of the trigger. For example, if "orient" is "column" and "align" is "start", the trigger will be aligned with the left side of the content (in addition to being placed above it). And if "orient" is row and "align" is "start", the trigger will be aligned with the top of the content (as well as being placed to the left of it).
    - Acceptable values: ['center', 'end', 'start', 'stretch']
- **height**
    - Determines the height/width of the icon and the minimum height of the content.
    - Acceptable values: Any valid css height value EXCEPT percentage (%).
- **toggle**
    - Determines whether the content is hidden when you click somewhere outside of the custom element, or when you click on a link inside the custom element.
    - Acceptable values: [null, true, false, '', 'true', 'false']
- **speed**
    - Determines the speed at which the visible/hidden transition happens.
    - Acceptable values: Any valid css transition speed.

## Slots

- **icon**
    - Use this slot to provide your own element for the trigger.

### Example

    <!-- Using a button as the trigger -->
    <wijit-reveal>
        <button slot="icon">Click Me</button>
        <div>
            Your Content
            ...
        </div>
    </wijit-reveal>

    <!-- Eliminate the icon altogether -->
    <wijit-reveal>
        <span slot="icon"></span>
        <div>
            Your Content
            ...
        </div>
    </wijit-reveal>

## CSS Custom Properties

This component exposes several custom css properties which affect the behavior of the component. You must set these properties on the wijit-reveal element in your styles.

### Note

These properties have analogs in the available custom attributes. The attribute value always takes precedence over the css property value.

    /* Example */
    <style>
      wijit-reveal {
        --align: start;
        --height: 45px;
        --orient: row;
        --speed: .5s
      }
    </style>

- **--align** See the "align" attribute.
- **--height** See the "height" attribute.
- **--orient** See the "orient" attribute.
- **--speed** See the "speed" attribute.

## Examples

###

