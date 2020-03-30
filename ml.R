print(getwd())

dtlim1 = readRDS('/app/dtlim1.rds');
dtpid = readRDS('/app/dtpid.rds');

pred<-list()
result<-list()
accuracy<-list()
subsummary<-list(pred,result,accuracy)

suppressMessages(suppressWarnings(require(randomForest)))
require(plyr,quietly=T)


# split into 10 sets
for (i in 1:10) {
    result[[i]]<-ddply(dtpid, .(Mut), function(., seed) {
        set.seed(seed); .[sample(1:nrow(.), trunc(nrow(.) * .1)),]
    }
    ,seed = i)
    rownames(result[[i]])<-result[[i]]$ID
    subsummary[[2]][[i]]<-result[[i]][,-1]    
}

# training, 1 time
train<-dtlim1[!row.names(dtlim1)%in%rownames(result[[1]]),]

#rf filtering
rf <- randomForest(Mut~.,train,importance=T)
imp <- importance(rf)
imp <- imp[,ncol(imp)-1]
rf.genes <- names(imp)[order(imp,decreasing=T)[1:20]]
train<-train[,c("Mut",rf.genes)]

model<-randomForest(Mut~.,train)
subsummary[[1]][[1]]<-predict(model,result[[1]])
subsummary[[3]][[1]]<-sum(ifelse(subsummary[[1]][[1]]==result[[1]]$Mut,100,0))/nrow(result[[1]])

print(subsummary[[3]])
