# PCShowdown
A website that lets users showcase their PCs.

# Technologies used
  Golang
  TypeScript
  jQuery
  Handlebars
  SQlite3


## Screenshots
![Screenshot of the app](./screenshots/screenshot1.PNG)

![Screenshot of the app](./screenshots/screenshot2.PNG)

![Screenshot of the app](./screenshots/screenshot3.PNG)

## Usage

### Prerequisites

Install the latest version of NPM
* npm

  ```sh
  npm install npm@latest -g
  ```
  
 Install the latest version of [Golang](https://golang.org/dl/) 
 
 ### Installation
 
1. Install NPM packages

   ```sh
   npm install
   ```
2. Install [Goose](https://github.com/pressly/goose)

  ```sh
  go get -u github.com/pressly/goose/cmd/goose
  ```

### Initialization

Initialize the database
  ```sh
  cd migrations
  ```
  
  ```sh
  [goose directory] sqlite3 ../pcshowdown.db up
  ```

Run the go program

  ```sh
  go run .
  ```

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
