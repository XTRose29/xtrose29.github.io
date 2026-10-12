# Tianruo Rose Xu

Personal academic website for Tianruo Rose Xu, hosted with GitHub Pages and Jekyll.

## Local Development

Use Ruby 3.3 (see `.ruby-version`); the GitHub Pages dependencies do not support Ruby 4.
On macOS with Homebrew, select the compatible Ruby in your terminal:

```bash
brew install ruby@3.3
export PATH="$(brew --prefix ruby@3.3)/bin:$PATH"
```

Install Ruby dependencies, then run the site locally:

```bash
bundle install
bundle exec jekyll build
bundle exec jekyll serve -l -H localhost
```

The site will be available at `http://localhost:4000`.

## Content

- Main page: `_pages/about.md`
- Publications: `_publications/`
- Teaching: `_teaching/`
- Site config: `_config.yml`
