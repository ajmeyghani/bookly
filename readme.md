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
- Modify the config file in `./config.js`

Then you can use the following commands to the build the book:

- Build the book in all formats: `bookly build -a`
- Build the chapters only: `bookly build -e`
- Build the book in give formats:

		bookly build -f 'format1, format2, ...'

	possible formats are: `pdf`, `html`, `epub`, `mobi`, `md`

	For example, the following converts the book in `pdf` and `html`

		bookly build -f 'pdf, html'
