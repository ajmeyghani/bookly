# Bookly

A simple command-line tool for generating ebooks or documents in different formats. It uses pandoc behind the scense to conver the documents.

# Requirements

- node > 0.12.0 (you use [nvm](https://github.com/creationix/nvm) to manage your node versions)

- [pandoc](http://pandoc.org/installing.html)

- Amazon [KindleGen](https://www.amazon.com/gp/feature.html?docId=1000765211)

- [python](https://github.com/yyuu/pyenv) (for some pandoc filters)

- phantomjs (for making pdfs from html chapters)

    ```
    # Windows (MSVC 2013), 64-bit, for Windows Vista or later, bundles VC++ Runtime 2013
    $ curl -L http://astefanutti.github.io/decktape/downloads/phantomjs-msvc2013-win64.exe -o bin\phantomjs.exe
    # Mac OS X (Cocoa), 64-bit, for OS X 10.6 or later
    $ curl -L http://astefanutti.github.io/decktape/downloads/phantomjs-osx-cocoa-x86-64 -o bin/phantomjs
    # Linux (CentOS 6), 64-bit
    $ curl -L http://astefanutti.github.io/decktape/downloads/phantomjs-linux-centos6-x86-64 -o bin/phantomjs
    # Linux (CentOS 7), 64-bit
    $ curl -L http://astefanutti.github.io/decktape/downloads/phantomjs-linux-centos7-x86-64 -o bin/phantomjs
    # Linux (Debian 8), 64-bit
    $ curl -L http://astefanutti.github.io/decktape/downloads/phantomjs-linux-debian8-x86-64 -o bin/phantomjs
    ```

- [latex](http://miktex.org/download) (for building pdf)

# Getting Started

- Install with `npm i bookly -g`
- Create a new project with `bookly new docname`
- Go to your book folder: `cd docname`
- Update the book name in `./config.js` if you need to.
- Update `book.txt`
- Start writing the book (or your document) in the `chapters` folder.

Then you can use the following commands to the build the book:

## Build Each Chapter

- Build the chapters only: `bookly build -e`
- Convert each html chapter to pdf: `bookly build -e && bookly build -r`

## Build the Book

- Build the book in all formats: `bookly build -a`

- Build the book in give formats:

		bookly build -f 'format1, format2, ...'

	possible formats are: `pdf`, `html`, `epub`, `mobi`, `md`, `docx`

	For example, the following converts the book in `pdf` and `html`

		bookly build -f 'pdf, html'

### Options

The `build` command accepts the following options:

- `-c (--config)`: Specifies the name of the `config` file in the root of the project.

- `-e (--chapters-only)`: Only converts each chapter to html: `bookly build -e`

- `-r (--render)`: Render html chapters with phantom: `bookly build -r`

    Renders each chapter in pdf. **Only after each chapter is created with the `e` or `a` flag:**, i.e.

        bookly build -e

- `-p (--patterns)`: List of read file patterns, eg:

        bookly build -f 'html' -p '**/*.markdown'

    The `-p` defines a list of pattern(s) that overrides the default pattern (`**/*.md`). Multiple patterns can be passed in:

        bookly -p '*.md, **/*.md'

    **Note:** That pattern should exist, otherwise Pandoc will throw an error.

- `-f (--formats)`: Specifies book output formats. Possible options are: `pdf`, `epub`, `html`, `mobi`, `md`, `docx`. Multiple formats can be given as a list:

        bookly build -f 'html, epub, pdf'

- `-a (--all)`: Converts the book to all formats:

        bookly build -a

    This will convert each chapter to html. In addition, it will convert the book to `pdf`, `html`, `epub`, `mobi`, `md`, and `docx` formats.

- `-n (--version-number)`: Version number value for the book:

        bookly build -f 'pdf' -n 'v0.0.1'
