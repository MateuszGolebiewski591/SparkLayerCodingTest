package main

import (
	"encoding/json"
	"net/http"
	"sync"
)

type TODO struct {
	Title       string
	Description string
}

var TODOList = []TODO{}

// Use of a mutex lock prevents data from being updated and read at the same time
var lock sync.Mutex

func main() {
	http.HandleFunc("/", ToDoListHandler)
	http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	/*We check the received method to ascertain that the server can handle it.
	If it's not a valid method, we return an error.*/
	if r.Method == "GET" {
		GetTODOListHandler(w, r)
	} else if r.Method == "POST" {
		UpdateTODOListHandler(w, r)
	} else {
		http.Error(w, "Invalid Request", http.StatusMethodNotAllowed)
	}
}

func GetTODOListHandler(w http.ResponseWriter, r *http.Request) {
	lock.Lock()
	//We use json.Encode to marshal the slice into a json format and put it in a buffer which is more suitable for a HTTP response
	err := json.NewEncoder(w).Encode(TODOList)
	if err != nil {
		http.Error(w, "Server Error", http.StatusInternalServerError)
	}
	lock.Unlock()
}

func UpdateTODOListHandler(w http.ResponseWriter, r *http.Request) {
	var newTODO TODO
	//We use json.Decode so we can read from the HTTP buffer and retreive the input JSON
	err := json.NewDecoder(r.Body).Decode(&newTODO)
	if err != nil {
		http.Error(w, "Server Error", http.StatusInternalServerError)
	}
	lock.Lock()
	TODOList = append(TODOList, newTODO)
	lock.Unlock()
	//After updating the TODO list, we use the previous functionality to return the updated slice
	GetTODOListHandler(w, r)
}
