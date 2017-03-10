package handler

import (
	"github.com/ndphu/espresso-commons/dao"
	"github.com/ndphu/espresso-commons/model/command"
	"github.com/ndphu/espresso-commons/repo"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"net/http"
	"time"
)

func AddCommandHandler(s *mgo.Session, e *gin.Engine) {
	textCommandRepo := repo.NewTextCommandRepo(s)

	e.POST("/esp/v1/text_commands", func(c *gin.Context) {
		var tc command.TextCommand
		err := c.BindJSON(&tc)
		if err != nil {
			returnError(c, err)
		} else {
			tc.Timestamp = time.Now()
			err = dao.Insert(textCommandRepo, &tc)
			if err != nil {
				returnError(c, err)
			} else {
				c.JSON(http.StatusOK, tc)
			}
		}
	})
}
