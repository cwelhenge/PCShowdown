// Description: Interacts with database.go and server.go
//				to connect to database and start the server.
//
// Author: Chamod

package main

import "log"

func main() {

	database, err := ConnectToDB()
	if err != nil {
		log.Fatalf("cannot open database: %s\n", err)
	}

	server := Server{db: database}
	server.StartServer(":1337")

}
