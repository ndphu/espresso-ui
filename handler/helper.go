package handler

import (
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

func returnError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": err})
}
