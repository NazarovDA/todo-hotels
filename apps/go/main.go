package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

var db *sql.DB

type FieldValue struct {
	Value string `json:"value"`
}

type Body struct {
	Value string `json:"value"`
	Id    string `json:"id"`
}

type GetStruct struct {
	Id string `json:"id"`
}

var taskField string = "task_field_value"

func getDbUrl() string {
	DB_HOST, _ := os.LookupEnv("DB_HOST")
	DB_USER, _ := os.LookupEnv("DB_USER")
	DB_PASSWORD, _ := os.LookupEnv("DB_PASSWORD")
	DB_PORT, _ := os.LookupEnv("DB_PORT")
	DB_NAME, _ := os.LookupEnv("DB_NAME")
	println(os.Environ())
	return fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
}

func initDb(dbUrl string) {
	var err error
	db, err = sql.Open("postgres", dbUrl)

	if err != nil {
		panic(err.Error())
	}

	stmt, err := db.Prepare("SELECT * FROM users")
	if err != nil {
		panic(err.Error())
	}

	res, err := stmt.Exec()
	if err != nil {
		panic(err.Error())
	}
	fmt.Println(res)

	if err != nil {
		panic(err.Error())
	}

	if db.Ping() != nil {
		panic(dbUrl)
	}

	fmt.Println("Connected to db")
}

func postField(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	var fieldValue FieldValue
	_ = json.NewDecoder(r.Body).Decode(&fieldValue)

	stmt, err := db.Prepare(fmt.Sprintf("INSERT INTO %s VALUES ($1, $2)", taskField))
	if err != nil {
		panic(err.Error())
	}

	_, err = stmt.Exec(fieldValue.Value, params["id"])

	if err != nil {
		panic(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Body{
		Value: fieldValue.Value,
		Id:    params["id"],
	})
}

func updateField(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	var fieldValue FieldValue
	_ = json.NewDecoder(r.Body).Decode(&fieldValue)

	stmt, err := db.Prepare("UPDATE task_fields SET value=$1 WHERE id=$2")
	if err != nil {
		panic(err.Error())
	}

	_, err = stmt.Exec(fieldValue.Value, params["id"])

	if err != nil {
		panic(err.Error())
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Body{
		Value: fieldValue.Value,
		Id:    params["id"],
	})
}

func deleteField(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	stmt, err := db.Prepare("DELETE FROM task_fields WHERE id=$1")
	if err != nil {
		panic(err.Error())
	}

	_, err = stmt.Exec(params["id"])

	if err != nil {
		panic(err.Error())
	}
	w.WriteHeader(http.StatusOK)
}

func getField(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var ids []GetStruct
	_ = json.NewDecoder(r.Body).Decode(&ids)

	for _, id := range ids {
		stmt, err := db.Prepare("SELECT id, value FROM task_fields WHERE id=$1")
		if err != nil {
			panic(err.Error())
		}

		var field Body
		err = stmt.QueryRow(id.Id).Scan(&field.Id, &field.Value)
		if err != nil {
			panic(err.Error())
		}

		json.NewEncoder(w).Encode(field)
	}
}

func main() {
	initDb(getDbUrl())
	defer db.Close()

	router := mux.NewRouter()

	router.HandleFunc("/field/{id}", postField).Methods("POST")
	router.HandleFunc("/field/get", getField).Methods("POST")
	router.HandleFunc("/field/{id}", updateField).Methods("PUT")
	router.HandleFunc("/field/{id}", deleteField).Methods("DELETE")

	port, ok := os.LookupEnv("GOLANG_PORT")

	if !ok {
		panic("NO PORT")
	}

	println(port)
	http.ListenAndServe(":"+port, router)
}
