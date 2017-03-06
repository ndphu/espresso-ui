package main

import (
	"github.com/ndphu/espresso-commons"
	"github.com/ndphu/espresso-commons/dao"
	"github.com/ndphu/espresso-commons/messaging"
	"github.com/ndphu/espresso-commons/model"
	"github.com/ndphu/espresso-commons/repo"
	"golang.org/x/net/websocket"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io"
	"log"

	"fmt"
	"net/http"
)

var (
	Session        *mgo.Session
	Database       *mgo.Database
	MessageRounter *messaging.MessageRouter
)

func EchoServer(ws *websocket.Conn) {
	io.Copy(ws, ws)
}

type IRAgentMessageHandler struct {
}

func (i *IRAgentMessageHandler) OnNewMessage(msg *model.Message) {
	log.Println("New message:", msg.Type)
}

func main() {
	// database
	log.Println("Connecting to database")
	s, err := mgo.Dial("127.0.0.1:27017")
	if err != nil {
		log.Println("Failed to connect to DB")
		panic(err)
	}

	Session = s
	Database = Session.DB(commons.DBName)

	IRMessageRepo := &repo.IREventRepo{
		Database: Database,
		Session:  Session,
	}
	// end database

	// messaging
	log.Println("Connecting to broker...")
	MessageRounter, err = messaging.NewMessageRouter("127.0.0.1", 1883, "", "", fmt.Sprintf("espresso-ui-%d", commons.GetRandom()))
	if err != nil {
		panic(err)
	}

	irAgentMessageHandler := IRAgentMessageHandler{}

	err = MessageRounter.Subscribe(commons.IRAgentEventTopic, &irAgentMessageHandler)
	if err != nil {
		panic(err)
	}
	defer MessageRounter.Unsubscribe(commons.IRAgentEventTopic, &irAgentMessageHandler)

	// end messaging

	// web backend
	r := gin.Default()

	r.GET("/esp/v1/event/ir", func(c *gin.Context) {
		irMessages := make([]model.IRMessage, 0)
		err := dao.FindAllWithSort(IRMessageRepo, bson.M{}, 0, 100, "-_id", &irMessages)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		} else {
			for i := 0; i < len(irMessages); i++ {
				irMessages[i].UnixTimestamp = irMessages[i].Timestamp.Unix()
			}
			c.JSON(http.StatusOK, irMessages)
		}
	})

	r.GET("/esp/v1/ws", func(c *gin.Context) {
		handler := websocket.Handler(EchoServer)
		handler.ServeHTTP(c.Writer, c.Request)
	})

	r.Run(":80")
	// end web backend
}
