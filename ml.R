# load(file = "./public/r/exp.Rda");
# load(file = "./public/r/meta.Rda");

print(getwd())
load(file = "/app/exp.Rda");
load(file = "/app/meta.Rda");


picklimma <- function(expr, factor, p, fc) {
	library(limma)
	design <- model.matrix(~0+as.factor(factor))
	colnames(design) <- c("contrast", "normal")
	fit <- lmFit(expr, design)
	cont.matrix <- makeContrasts(contrast=normal-contrast, levels=design)
	fit1 <- eBayes(contrasts.fit(fit, cont.matrix))
	topTable(fit1, coef="contrast", number=nrow(expr), p.value=p, lfc=fc)
}

limfilcon<-function(x,p,fc) {
    lim<-picklimma(x,Meta.ezp$EZH2_mutation,p,fc)
    eslim<-Exprs.ezp[rownames(lim),]
    dtlim<-data.frame(Mut=factor(Meta.ezp$EZH2_mutation),t(eslim))
}

dtlim1<-limfilcon(Exprs.ezp,0.05,0)
dtpid<-cbind(rownames(dtlim1),dtlim1)
names(dtpid)[names(dtpid)=="rownames(dtlim1)"]="ID"

pred<-list()
result<-list()
accuracy<-list()
subsummary<-list(pred,result,accuracy)
# library(randomForest)
suppressMessages(suppressWarnings(require(randomForest)))
require(plyr,quietly=T)