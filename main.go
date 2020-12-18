package main

import "log"

func main() {

	database, err := ConnectToDB()
	if err != nil {
		log.Fatalf("cannot open database: %s\n", err)
	}

	server := Server{db: database}
	server.StartServer(":8000")

}
