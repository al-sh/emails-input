# al-sh/emails-input
Published on GitHub Pages: https://al-sh.github.io/emails-input/
Tests page: https://al-sh.github.io/emails-input/index-test.html

## Usage
var myEmailsInput = new EmailsInput(document.querySelector('#' + domNodeId));

### Options
var myEmailsInput = new EmailsInput(document.querySelector('#' + domNodeId), { textAddMore: 'custom text from options...' } );
Only one option supported now. 
#### options.textAddMore
You can customize inner hint text by using option textAddMore.
default value: "add more people..."

## API

### Subscribe
Use **onChange(function(event))** to subscribe changes
### #Details
onChange event calls *function* passed through parameter of its call with *event*
#### Event Structure
**Event examples**
{action: "delete", items: "test@test.com", newItems: Array(3)}
{action: "add", items: "m4dd@ya.ru", newItems: Array(4)}

*action* property - type of action (delete/add)
*item* - deleted/added items
*newItems* - list of new emails (after add or delete)

#### Usage Examples
var em = new EmailsInput(document.querySelector('#firstEmailEditor'));
em.onChange((event) => { console.log(event) });
em.onChange((event) => { alert(event.items); });

## Build:
npm run build

## Tests
visit https://al-sh.github.io/emails-input/index-test.html to view tests
