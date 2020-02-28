import { Component } from '@angular/core';
import { v4 } from 'uuid';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import * as _ from 'lodash'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ordenDia5';

  nodes: any[];

 nodes2 = [{name: 'root'}, {name: 'root2'}];
 asyncChildren = new Array(4).fill(null).map((item, n) => ({
   name: 'async child2.' + n,
   subTitle: 'async child ' + n,
   hasChildren: n < 5
 }));

 customTemplateStringOptions: ITreeOptions = {
   // displayField: 'subTitle',
   isExpandedField: 'expanded',
   idField: 'uuid',
   getChildren: this.getChildren.bind(this),
   actionMapping:{},
   nodeHeight: 23,
   allowDrag: (node) => node.isLeaf,
   // (node) => {
     // console.log('allowDrag?');
     //return true;
   //},
   allowDrop: (node) => {
     // console.log('allowDrop?');
     return true;
   },
   useVirtualScroll: true,
   animateExpand: true
 };
 constructor() {
 }
 ngOnInit() {
   setTimeout(() => {
     this.nodes = [
       {
         expanded: true,
         name: 'root expanded',
         subTitle: 'the root',
         children: [
           {
             name: 'child2',
             subTitle: 'a bad child',
             hasChildren: false
           },
           {
             name: 'child2',
             subTitle: 'a bad child',
             hasChildren: false
           }
         ]
       },
       {
         name: 'root2',
         subTitle: 'the second root',
         children: [
           {
             name: 'child2.1',
             subTitle: 'new and improved',
             uuid: '11',
             hasChildren: false
           }, {
             name: 'child2.2',
             subTitle: 'new and improved2',
             children: [
               {
                 uuid: 1001,
                 name: 'subsub',
                 subTitle: 'subsub',
                 hasChildren: false
               }
             ]
           }
         ]
       },
       {
         name: 'asyncroot',
         hasChildren: true
       }
     ];

     for (let i = 0; i < 1000; i++) {
       this.nodes.push({
         name: `rootDynamic${i}`,
         subTitle: `root created dynamically ${i}`,
         children: new Array(10).fill(null).map((item, n) => ({
           name: `rootChildDynamic${i}.${n}`,
           subTitle: `rootChildDynamicTitle${i}.${n}`
         }))
       });
     }
   }, 1);
 }

 getChildren(node: TreeNode) {
   return new Promise((resolve, reject) => {
     setTimeout(() => resolve(this.asyncChildren.map((c) => {
       return Object.assign({}, c, {
         hasChildren: node.level < 5
       });
     })), 2000);
   });
 }

 addNode(tree: any) {
   this.nodes[0].children.push({

     name: 'a new child'
   });
   tree.treeModel.update();
 }

 childrenCount(node: TreeNode): string {
   return node && node.children ? `(${node.children.length})` : '';
 }

 filterNodes(text: string, tree: any) {
   tree.treeModel.filterNodes(text);
 }

 activateSubSub(tree: any) {
   // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
   tree.treeModel.getNodeById(1001)
     .setActiveAndVisible();
 }

 onEvent(event: any) {
   console.log(event);
 }

 onInitialized(tree: any) {
   // tree.treeModel.getNodeById('11').setActiveAndVisible();
 }

 go($event: any) {
   $event.stopPropagation();
   alert('this method is on the app component');
 }

 activeNodes(treeModel: TreeModel) {
   console.log(treeModel.activeNodes);
 }

 deleteNode(node, tree){
  let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });
        tree.treeModel.update();
        /*
        if (node.parent.data.children.length === 0) {
            node.parent.data.hasChildren = false;
        }
        */
  }
}
