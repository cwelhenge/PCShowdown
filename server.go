// Description: Responds to client requests to the server.
//
// Author: Chamod

package main

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Server struct to store server components
type Server struct {
	router *mux.Router
	db     *Database
}

// API functions

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
	links, err := server.db.AddPC(pc)
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

// getPCs gets all PCs
func (server *Server) getPCS(writer http.ResponseWriter, request *http.Request) {
	oID, err := strconv.Atoi(mux.Vars(request)["page_number"])
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
	limit, err := strconv.Atoi(mux.Vars(request)["limit"])
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	pcs, err := server.db.GetPCS(oID, limit)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(writer)
	err = encoder.Encode(pcs)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

// getPCs gets all PCs
func (server *Server) getPC(writer http.ResponseWriter, request *http.Request) {
	linkID := mux.Vars(request)["link_id"]

	// Get PC from db
	pc, err := server.db.GetPC(linkID)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	// Write back the pc as json
	writer.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(writer)
	err = encoder.Encode(pc)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

// updatePC updates the pc of given link_id
func (server *Server) updatePC(writer http.ResponseWriter, request *http.Request) {
	var pc PC

	linkID := mux.Vars(request)["link_id"]

	// get PC info from request
	decoder := json.NewDecoder(request.Body)
	err := decoder.Decode(&pc)

	if pc.Name == "" || pc.Info == "" {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	// update the pc in db
	pc, err = server.db.UpdatePC(linkID, pc)

	if err != nil {
		// Cannot edit with view link
		if err == sql.ErrNoRows {
			http.Error(writer, err.Error(), http.StatusForbidden)
			return
		}
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write back the updated pc as json
	writer.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(writer)
	err = encoder.Encode(pc)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

// deletePC delete the pc of given pc id
func (server *Server) deletePC(writer http.ResponseWriter, request *http.Request) {

	linkID := mux.Vars(request)["link_id"]

	// delete pc from db
	err := server.db.DeletePC(linkID)

	if err != nil {
		// not edit link
		if err == sql.ErrNoRows {
			http.Error(writer, err.Error(), http.StatusForbidden)
			return
		}
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

// Website functions

// getAddPCPage Gets home page
func (server *Server) getHomePage(writer http.ResponseWriter, request *http.Request) {
	http.ServeFile(writer, request, "./dist/static/index.html")
}

// getAddPCPage Gets the page to submit a pc
func (server *Server) getAddPCPage(writer http.ResponseWriter, request *http.Request) {
	http.ServeFile(writer, request, "./dist/static/addpc.html")
}

// getPCPage Gets the page of a pc
func (server *Server) getPCPage(writer http.ResponseWriter, request *http.Request) {
	linkID := mux.Vars(request)["link_id"]

	// Get links from db
	links, err := server.db.GetLinks(linkID)

	if err != nil {
		// no rows, mean bad id
		if err == sql.ErrNoRows {
			http.Error(writer, err.Error(), http.StatusBadRequest)
			return
		}
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	data, err := server.db.GetPC(linkID)
	if err != nil {
		// no rows, mean bad id
		if err == sql.ErrNoRows {
			http.Error(writer, err.Error(), http.StatusBadRequest)
			return
		}
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	// Execute template
	tmpl := template.Must(template.ParseFiles("./dist/viewpc.html"))
	tmpl.ExecuteTemplate(writer, "viewpc.html", map[string]interface{}{"Links": links,
		"Data": data})
}

// setupRoutes sets up routes for the router
func (server *Server) setupRoutes() {
	if server.router == nil {
		log.Fatalln("Router is not initialized.")
	}

	server.router.StrictSlash(true)

	// API

	subrouter := server.router.PathPrefix("/api/v1").Subrouter()
	// PCs
	subrouter.HandleFunc("/pcs", server.createPC).Methods(http.MethodPost)
	// limit = how many entries per page
	subrouter.HandleFunc("/pcs/{page_number}/{limit}", server.getPCS).Methods(http.MethodGet)
	// get a pc
	subrouter.HandleFunc("/pcs/{link_id}", server.getPC).Methods(http.MethodGet)
	// update a pc
	subrouter.HandleFunc("/pcs/{link_id}", server.updatePC).Methods(http.MethodPut)
	// delete a pc
	subrouter.HandleFunc("/pcs/{link_id}", server.deletePC).Methods(http.MethodDelete)

	// Website

	server.router.Path("/").Methods(http.MethodGet).HandlerFunc(server.getHomePage)
	server.router.Path("/pcs/{link_id}").Methods(http.MethodGet).HandlerFunc(server.getPCPage)
	server.router.Path("/addpc").Methods(http.MethodGet).HandlerFunc(server.getAddPCPage)
	server.router.PathPrefix("/").Methods(http.MethodGet).Handler(http.FileServer(http.Dir("./dist/static")))
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
