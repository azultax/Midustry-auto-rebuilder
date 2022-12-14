Events.on(EventType.ClientLoadEvent, e => {
    const version = "1.02";
    const buttonStyleTogglet = Styles.logicTogglet;
    const buttonStyle = Styles.logict;

    const dragTable = extend(Table, {
        curx : 100, cury : 200, flip : true, fromx : 0, fromy : 0
    });
    dragTable.name = "table";
    Vars.ui.hudGroup.addChild(dragTable);

    dragTable.left().bottom();
    dragTable.update(() => {
        dragTable.curx = Mathf.clamp(dragTable.curx, 0, Core.graphics.getWidth() - 100 - dragTable.getWidth());
        dragTable.cury = Mathf.clamp(dragTable.cury, 0, Core.graphics.getHeight() - 100 - dragTable.getHeight());
        dragTable.setPosition(dragTable.curx, dragTable.cury);
    }); 



    dragTable.table(cons(t => {
        var titleLabel = new Label("Rebuilder");
        titleLabel.setAlignment(Align.center);
        titleLabel.addListener(extend(InputListener, {
            touchDown(event, x, y, pointer, button){
                dragTable.fromx = x;
                dragTable.fromy = y;
                return true;
            },
            touchDragged(event, x, y, pointer){
                let v = dragTable.localToStageCoordinates(Tmp.v1.set(x, y));
                dragTable.curx = v.x - dragTable.fromx;
                dragTable.cury = v.y - dragTable.fromy;
            }
        }));
        
        t.add(titleLabel).center().fillX();
        t.row();
        t.label(() => "" + version);
        t.row();

        t.table(cons(sqb => {
            sqb.button(String.fromCharCode(Iconc.refresh), buttonStyle, () => {
                Call.sendChatMessage("/sync");
            }).size(36, 36);
        
            sqb.button("rebuild", buttonStyle, () => {
                rebuildBlocks();
            }).size(100, 36);
        }));
        
        t.row();

    })).get().background(Styles.black6);
});

function rebuildBlocks(){
    var player = Vars.player;
    if(!player.unit().canBuild()) return;
    var p = 0;
    for(let bpid = 0; bpid < Vars.state.teams.get(player.team()).blocks.size; bpid++){
        let block = Vars.state.teams.get(player.team()).blocks.get(bpid);
        if(Mathf.len(block.x - player.tileX(), block.y - player.tileY()) >= 200) continue;
        p++;
        if(p > 511) break;
        player.unit().addBuild(new BuildPlan(block.x, block.y, block.rotation, Vars.content.block(block.block), block.config));
    }
}

Events.run(Trigger.draw, () => {
    if(!Vars.state.isGame() || !enUnitHealthBar) return;
    healthBar.drawAll();
});
