package handler

import (
	"encoding/json"
	"fmt"
	"github.com/ndphu/espresso-commons/dao"
	"github.com/ndphu/espresso-commons/messaging"
	"github.com/ndphu/espresso-commons/model/command"
	"github.com/ndphu/espresso-commons/repo"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"net/http"
	"time"
)

func AddCommandHandler(s *mgo.Session, e *gin.Engine, msgr *messaging.MessageRouter) {
	textCommandRepo := repo.NewTextCommandRepo(s)
	gpioCommandRepo := repo.NewGPIOCommandRepo(s)

	e.POST("/esp/v1/text_commands", func(c *gin.Context) {
		var tc command.TextCommand
		err := c.BindJSON(&tc)
		if err != nil {
			returnError(c, err)
		} else {
			fmt.Println(tc)
			tc.Timestamp = time.Now()
			err = dao.Insert(textCommandRepo, &tc)
			if err != nil {
				returnError(c, err)
			} else {
				//json
				data, err := json.Marshal(tc)
				if err != nil {
					returnError(c, err)
				}

				msg := messaging.Message{
					Destination: messaging.MessageDestination_TextCommand,
					Source:      messaging.MessageSource_UI,
					Type:        messaging.MessageType_ExecuteTextCommand,
					Payload:     string(data),
				}

				err = msgr.Publish(msg)
				if err != nil {
					returnError(c, err)
				} else {
					c.JSON(http.StatusOK, tc)
				}

			}
		}
	})

	e.POST("/esp/v1/gpio_commands", func(c *gin.Context) {
		var gc command.GPIOCommand
		err := c.BindJSON(&gc)
		if err != nil {
			returnError(c, err)
		} else {
			fmt.Println(gc)
			gc.Timestamp = time.Now()
			err = dao.Insert(gpioCommandRepo, &gc)
			if err != nil {
				returnError(c, err)
			} else {
				//json
				data, err := json.Marshal(gc)
				if err != nil {
					returnError(c, err)
				}

				msg := messaging.Message{
					Destination: messaging.MessageDestination_GPIOCommand,
					Source:      messaging.MessageSource_UI,
					Type:        messaging.MessageType_ExecuteGPIOCommand,
					Payload:     string(data),
				}

				err = msgr.Publish(msg)
				if err != nil {
					returnError(c, err)
				} else {
					c.JSON(http.StatusOK, gc)
				}

			}
		}
	})
}
