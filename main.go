package main

import (
	"github.com/ndphu/espresso-commons"
	"github.com/ndphu/espresso-commons/db"
	"github.com/ndphu/espresso-commons/model"
	"github.com/ndphu/manga-crawler/dao"
	"golang.org/x/net/websocket"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io"
	"log"
	"net/http"
)

var (
	Session  *mgo.Session
	Database *mgo.Database
)

func EchoServer(ws *websocket.Conn) {
	var msg []byte
	_, err := ws.Read(&msg)
	if err != nil {
		log.Println(err)
	}
	log.Println("Client:", msg)
	io.Copy(ws, ws)
}

func main() {
	log.Println("Connecting to database")
	s, err := mgo.Dial("127.0.0.1:27017")
	if err != nil {
		log.Println("Failed to connect to DB")
		panic(err)
	}

	Session = s
	Database = Session.DB(commons.DBName)

	IRMessageRepo := &db.IREventRepo{
		Database: Database,
		Session:  Session,
	}

	r := gin.Default()

	r.GET("/esp/v1/event/ir", func(c *gin.Context) {
		irMessages := make([]model.IRMessage, 0)
		//err := dao.GetAll(IRMessageRepo, bson.M{}, &irMessage)
		err := dao.GetAllWithRangeAndSort(IRMessageRepo, bson.M{}, 9999, 0, "-timestamp", &irMessages)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		} else {
			c.JSON(http.StatusOK, irMessages)
		}
	})

	r.GET("/esp/v1/ws", func(c *gin.Context) {
		handler := websocket.Handler(EchoServer)
		handler.ServeHTTP(c.Writer, c.Request)
	})

	r.Run(":80")
}
