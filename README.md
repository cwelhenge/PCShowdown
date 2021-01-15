# PCShowdown
A website that lets users add, edit, and remove PCs. \
Users can share links to PCs with others or browse PCs.\
Uses a RESTful API to retrieve and accept data.

## Technologies used
  Backend
   * [Golang](https://golang.org/) 
   * [SQlite3](https://www.sqlite.org/index.html)
   
  Frontend
   * [TypeScript](https://www.typescriptlang.org/)
   * [jQuery](https://jquery.com/) 
   * [Handlebars](https://handlebarsjs.com/) 

## Screenshots
![Screenshot of the app](./screenshots/screenshot1.PNG)

![Screenshot of the app](./screenshots/screenshot2.PNG)

![Screenshot of the app](./screenshots/screenshot3.PNG)

## Usage

### Prerequisites

1. Install the latest version of NPM

  ```console
  npm install npm@latest -g
  ```
  
 2. Install the latest version of [Golang](https://golang.org/dl/) 
 
 ### Installation
 
1. Install NPM packages

   ```console
   npm install
   ```
2. Install [Goose](https://github.com/pressly/goose)

    ```console
    go get -u github.com/pressly/goose/cmd/goose
    ```

### Initialization

1. Go to migrations directory

    ```console
    cd migrations
    ```
2. Initialize the database
  
    ```console
    [goose directory] sqlite3 ../pcshowdown.db up
    ```
3. Run the go program

    ```console
    go run .
    ```

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
