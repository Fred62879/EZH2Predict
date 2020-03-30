n = as.numeric(input[1]);
m = as.numeric(input[2]);

# (i) Load filtered dataset
dtlim1 = readRDS('/app/dtlim1.rds');
dtpid = readRDS('/app/dtpid.rds');

# dtlim1 = readRDS('./dtlim1.rds');
# dtpid = readRDS('./dtpid.rds');

# (ii) Initialize result array
pred<-list()
result<-list()
accuracy<-list()
subsummary<-list(pred,result,accuracy)

# (iii) Load library
suppressMessages(suppressWarnings(require(randomForest)))
require(plyr,quietly=T)

# (iv) Split dtlim1 into ~10 subsets
for (i in 1 : n) {
    result[[i]]<-ddply(dtpid, .(Mut), function(., seed) {
        set.seed(seed); .[sample(1:nrow(.), trunc(nrow(.) * .1)),]
    }
    ,seed = i)
    rownames(result[[i]])<-result[[i]]$ID
    subsummary[[2]][[i]]<-result[[i]][,-1]    
}

# (v) training, 10 time
for (i in 1 : n) {
    train<-dtlim1[!row.names(dtlim1)%in%rownames(result[[i]]),]
    #rf filtering
    rf <- randomForest(Mut~.,train,importance=T)
    imp <- importance(rf)
    imp <- imp[,ncol(imp)-1]
    rf.genes <- names(imp)[order(imp,decreasing=T)[1:m]]
    train<-train[,c("Mut",rf.genes)]

    model = randomForest(Mut~.,train)
    subsummary[[1]][[i]] = predict(model,result[[i]])
    subsummary[[3]][[i]] = sum(ifelse(subsummary[[1]][[i]] == result[[i]]$Mut, 100, 0)) / nrow(result[[i]]);
}


print(subsummary[[3]])
return(subsummary[[3]])
