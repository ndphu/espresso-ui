package main

import (
	//"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/ndphu/espresso-commons"
	"github.com/ndphu/espresso-commons/dao"
	"github.com/ndphu/espresso-commons/messaging"
	"github.com/ndphu/espresso-commons/model"
	"github.com/ndphu/espresso-commons/repo"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"sync"
)

var (
	Session           *mgo.Session
	Database          *mgo.Database
	MessageRounter    *messaging.MessageRouter
	WSConnections     []*websocket.Conn
	WSConnectionsLock sync.RWMutex
	WSConnLock        sync.Mutex = sync.Mutex{}
	WSUpgrader                   = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	IREventRepo *repo.IREventRepo
)

// websocket

func wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := WSUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to set websocket upgrade: %+v", err)
		return
	}
	log.Println("New websocket connection")
	WSConnectionsLock.Lock()
	WSConnections = append(WSConnections, conn)
	WSConnectionsLock.Unlock()
}

// websocket

type IRAgentMessageHandler struct {
}

func (i *IRAgentMessageHandler) OnNewMessage(msg *model.Message) {
	WSConnectionsLock.RLock()

	for _, wsCon := range WSConnections {
		//_, err := wsCon.Write(data)
		irEventId := msg.Payload.(string)
		irEvent := model.IRMessage{}
		dao.FindById(IREventRepo, bson.ObjectIdHex(irEventId), &irEvent)
		irEvent.UnixTimestamp = irEvent.Timestamp.Unix()
		wsmsg := model.WebSocketMessage{
			Type:    msg.Type,
			Payload: irEvent,
		}
		WSConnLock.Lock()
		err := wsCon.WriteJSON(wsmsg)
		WSConnLock.Unlock()
		if err != nil {
			log.Println("Fail to deliver message to socket endpoint", err.Error())
		}
	}
	WSConnectionsLock.RUnlock()
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

	IREventRepo = &repo.IREventRepo{
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
	defer MessageRounter.Stop()

	irAgentMessageHandler := IRAgentMessageHandler{}

	err = MessageRounter.Subscribe(commons.IRAgentEventTopic, &irAgentMessageHandler)
	if err != nil {
		panic(err)
	}
	defer MessageRounter.Unsubscribe(commons.IRAgentEventTopic, &irAgentMessageHandler)

	// end messaging

	// websocket

	WSConnectionsLock = sync.RWMutex{}

	WSConnections = make([]*websocket.Conn, 0)

	//WSHander =
	// end websocket

	// web backend
	r := gin.Default()

	r.GET("/esp/v1/event/ir", func(c *gin.Context) {
		irMessages := make([]model.IRMessage, 0)
		err := dao.FindAllWithSort(IREventRepo, bson.M{}, 0, 100, "-_id", &irMessages)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		} else {
			for i := 0; i < len(irMessages); i++ {
				irMessages[i].UnixTimestamp = irMessages[i].Timestamp.Unix()
			}
			c.JSON(http.StatusOK, irMessages)
		}
	})

	r.GET("/esp/v1/ws/events", func(c *gin.Context) {
		wshandler(c.Writer, c.Request)
	})

	r.Run(":80")
	// end web backend
}
