# HelixNova — Genomics Intelligence Studio

A responsive, static educational DNA sequence exploration and classification dashboard with a midnight-indigo, electric-cyan biotechnology theme.

## Features

- DNA sequence validation (A, T, G and C)
- A/T/G/C nucleotide counts and proportions
- Sequence length and GC-content calculation
- Educational Group A / Group B prediction using a transparent GC-content threshold
- Four supplied illustrative sample sequences and one-click loading
- Training dataset table with load actions
- CSV export of the sequence feature table
- Midnight-indigo, violet and electric-cyan theme with optional light appearance
- Responsive layout for desktop, tablet and mobile

## Project files

```text
helixnova/
├── index.html
├── style.css
├── app.js
├── README.md
└── .gitignore
```

## Run locally

No build tools or package installation are required. Open `index.html` in a browser, or use the VS Code Live Server extension.

## Publish with GitHub Pages

1. Create a new GitHub repository named `helixnova`.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.

## Deploy with Vercel

Import the GitHub repository into Vercel. Select **Other** as the framework preset; no build command is required for this static site.

## Scientific note

HelixNova is an educational demonstration, not a validated biological classifier. The prediction uses a simple threshold and only four tiny illustrative examples. It must not be used for medical, diagnostic or research decisions.

## Customization

- Change colours and layout in `style.css`.
- Change sample sequences in the `samples` array in `app.js`.
- The demonstration threshold is in the `predict()` function in `app.js`.
