package main

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

// Database pointer
type Database struct {
	*sqlx.DB
}

// Link to a PC
type Link struct {
	LinkID     string
	Permission string
	PCID       int
}

// PC Info
type PC struct {
	PCID int
	Name string
	Info string
}

// Part of a PC
type Part struct {
	PartID int
	Type   string
	Brand  string
	Model  string
	Qty    int
	PCID   int
}

// ConnectToDB connects to the database
func ConnectToDB() (*Database, error) {
	db, err := sqlx.Connect("sqlite3", "file:pcshowdown.db?_fk=true")
	return &Database{db}, err
}

func (database *Database) makePC() {

}
