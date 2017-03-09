package handler

import (
	"github.com/ndphu/espresso-commons/dao"
	"github.com/ndphu/espresso-commons/model"
	"github.com/ndphu/espresso-commons/repo"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"net/http"
)

func AddDeviceHandler(s *mgo.Session, e *gin.Engine) {
	deviceRepo := repo.NewDeviceRepo(s)
	// all devices
	e.GET("/esp/v1/devices", func(c *gin.Context) {
		var devices []interface{}
		err := dao.FindAll(deviceRepo, bson.M{}, 0, 100, &devices)
		if err != nil {
			returnError(c, err)
		} else {
			c.JSON(http.StatusOK, devices)
		}
	})

	// get detail for single device
	e.GET("/esp/v1/device/:id", func(c *gin.Context) {
		id := c.Param("id")
		var device model.Device
		err := dao.FindById(deviceRepo, bson.ObjectIdHex(id), &device)
		if err != nil {
			returnError(c, err)
		} else {
			c.JSON(http.StatusOK, device)
		}
	})

	// add new service
	e.POST("/esp/v1/devices", func(c *gin.Context) {
		var device model.Device
		err := c.BindJSON(&device)
		if err != nil {
			returnError(c, err)
		} else {
			err = dao.Insert(deviceRepo, &device)
			if err != nil {
				returnError(c, err)
			} else {
				c.JSON(http.StatusOK, device)
			}
		}
	})
}

func returnError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": err})
}
