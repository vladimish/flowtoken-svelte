export const text = `
# Main Heading(H1)

![Alt](https://picsum.photos/150)

## Subheading(H2)

### Another Subheading(H3)

*Regular* text is just written as plain text. You can add **bold** text, *italic* text, and even ***bold italic*** text.

You can also create hyperlinks: [OpenAI](https://www.openai.com)

---

### Lists

#### Unordered List

- Item 1 and some *more*
- Item 2
    - Subitem 2.1
    - Subitem 2.2
- Item 3

#### Ordered List

1. First Item
2. Second Item
3. Third Item

---

### Code

\`Inline code\` with backticks.

\`\`\`python
# Python code block
def hello_world():
    print("Hello, world!")

def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
\`\`\`

\`\`\`javascript
// JavaScript example
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.map(item => item.name);
}
\`\`\`

\`\`\`rust
// Rust example
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}
\`\`\`

### Blockquotes

> This is a blockquote.
>
> This is part of the same quote.

### Tables

A table:

| a | b |
| - | - |
| 1 | 2 |
| 3 | 4 |

---

### Images

![Alt Text](https://picsum.photos/150 "Image Title")

### Horizontal Rule

---

### Task List

- [x] Task 1 completed
- [ ] Task 2 not completed
- [ ] Task 3 not completed
`;
