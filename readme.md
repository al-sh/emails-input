# al-sh/emails-input
Published on GitHub Pages: https://al-sh.github.io/emails-input/ <br/>
Tests page with examples: https://al-sh.github.io/emails-input/index-test.html <br/>
Tests for build version: https://al-sh.github.io/emails-input/index-testmin.html <br/>
if you want to watch examples and tests in IE11, visit Tests for build version.

## Install
Add emails-input.min.js and emails-input.min.css to your page. 

## Usage
var myEmailsInput = new EmailsInput(document.querySelector('#' + domNodeId));

### Options
var myEmailsInput = new EmailsInput(document.querySelector('#' + domNodeId), { textAddMore: 'custom text from options...' } );
Only one option supported now. 
#### options.textAddMore
You can customize inner hint text by using option textAddMore.
default value: "add more people..."

## API

### Get and Set list of emails

```
var myEmailsInput = new EmailsInput(document.querySelector('#' + domNodeId), { textAddMore: 'custom text from options...' } );

var testList = ['test@gmail.com', 'test2@gmail.com']

myEmailsInput.setEmails(testList);
//...your code...

var myEmails = myEmailsInput.getEmails();
```

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

---
## Build:
npm run build

## Tests
visit https://al-sh.github.io/emails-input/index-test.html to view tests <br/>
Tests for build version(for IE, specially): https://al-sh.github.io/emails-input/index-testmin.html 
