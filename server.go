package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Server struct to store server components
type Server struct {
	router *mux.Router
	db     *Database
}

// setupRoutes sets up routes for the router
func (server *Server) setupRoutes() {
	if server.router == nil {
		log.Fatalln("Router is not initialized.")
	}

	// API

	server.router.StrictSlash(true)
	// subrouter := server.router.PathPrefix("/api/v1").Subrouter()
	// topic
	// subrouter.HandleFunc("/topics", server.createTopic).Methods(http.MethodPost)
	// subrouter.HandleFunc("/topics", server.getTopics).Methods(http.MethodGet)
	// // comment
	// subrouter.HandleFunc("/topics/{topic_id}/comments", server.createComment).Methods(http.MethodPost)
	// subrouter.HandleFunc("/topics/{topic_id}/comments", server.getComments).Methods(http.MethodGet)
	// // upvote
	// subrouter.HandleFunc("/topics/{topic_id}/comments/{comment_id}/upvotes", server.upvoteComment).Methods(http.MethodPost)
	// subrouter.HandleFunc("/topics/{topic_id}/comments/{comment_id}/upvotes", server.getUpvotes).Methods(http.MethodGet)

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
func (server *Server) StartServer(addr string, database *Database) {
	// Setup routes and initialize
	server.initializeServer()
	// Start the server
	log.Fatal(http.ListenAndServe(addr, server.router))
}
