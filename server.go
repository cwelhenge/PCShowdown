package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Server struct to store server components
type Server struct {
	router *mux.Router
	db     *Database
}

// createPC creates a PC and writes back new PC info
func (server *Server) createPC(writer http.ResponseWriter, request *http.Request) {
	var pc PC

	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&pc)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	// Add to the db
	links, err := server.db.addPC(pc)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}
	// Encode the new links as json
	writer.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(writer)
	err = encoder.Encode(links)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

// setupRoutes sets up routes for the router
func (server *Server) setupRoutes() {
	if server.router == nil {
		log.Fatalln("Router is not initialized.")
	}

	// API

	server.router.StrictSlash(true)
	subrouter := server.router.PathPrefix("/api/v1").Subrouter()
	// topic
	subrouter.HandleFunc("/pcs", server.createPC).Methods(http.MethodPost)

	// Website

	// server.router.HandleFunc("/", getHomePage).Methods(http.MethodGet)
	server.router.PathPrefix("/").Handler(http.FileServer(http.Dir("./dist/static")))
	server.router.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./dist/static"))))

}

// initializeServer initializes server components
func (server *Server) initializeServer() {
	server.router = mux.NewRouter()
	server.setupRoutes()
}

// StartServer starts the server
func (server *Server) StartServer(addr string) {
	// Setup routes and initialize
	server.initializeServer()
	// Start the server
	log.Fatal(http.ListenAndServe(addr, server.router))
}
