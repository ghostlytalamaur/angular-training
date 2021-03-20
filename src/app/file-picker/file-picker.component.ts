import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

type Node = FolderNode | FileNode;

interface FolderNode {
  type: 'folder';
  name: string;
  children: Node[];
}

interface FileNode {
  type: 'file';
  name: string;
  file: File;
}

function createFolderNode(name: string): FolderNode {
  return {
    type: 'folder',
    name,
    children: []
  };
}

function createFileNode(name: string, file: File): FileNode {
  return {
    type: 'file',
    name,
    file
  };
}

function findFolderNode(nodes: Node[], name: string): FolderNode | undefined {
  return nodes.find(node => node.type === 'folder' && node.name === name) as FolderNode | undefined;
}

class FlatNode {
  constructor(
    public name: string,
    public level: number,
    public expandable: boolean
  ) {
  }
}

@Component({
  selector: 'app-file-picker',
  templateUrl: 'file-picker.component.html',
  styleUrls: ['file-picker.component.scss']
})
export class FilePickerComponent implements OnInit {

  flattener: MatTreeFlattener<Node, FlatNode>;
  treeControl: FlatTreeControl<FlatNode>;
  dataSource: MatTreeFlatDataSource<Node, FlatNode>;
  selection: SelectionModel<FlatNode>;
  flatNodeMap: Map<FlatNode, Node>;
  summarySize = 0;
  readProgress = new BehaviorSubject<number>(0);

  constructor() {
    this.flattener = new MatTreeFlattener<Node, FlatNode>(
      (node: Node, level: number) => this.transformer(node, level),
      flatNode => flatNode.level,
      flatNode => flatNode.expandable,
      node => FilePickerComponent.getChildren(node));
    this.treeControl = new FlatTreeControl<FlatNode>(
      flatNode => flatNode.level,
      flatNode => flatNode.expandable);
    this.treeControl.dataNodes = [];
    this.dataSource = new MatTreeFlatDataSource<Node, FlatNode>(this.treeControl, this.flattener, []);
    this.selection = new SelectionModel<FlatNode>(true);
    this.flatNodeMap = new Map<FlatNode, Node>();
  }

  private static getChildren(node: Node): Node[] | undefined {
    if (node.type === 'folder') {
      return node.children;
    }
    return undefined;
  }

  ngOnInit(): void {
  }

  onFileAdded(event: Event): void {
    if (!(event.target instanceof HTMLInputElement) || !event.target.files) {
      return;
    }

    const files = event.target.files;
    const newNodes: Node[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) {
        continue;
      }

      if (typeof (file as any).webkitRelativePath !== 'string') {
        continue;
      }
      const relPath: string = (file as any).webkitRelativePath;
      const pathParts = relPath.split('/');

      let newNode: Node | undefined;
      if (pathParts.length > 0) {
        let curNode: FolderNode | undefined = findFolderNode(newNodes, pathParts[0]);
        if (!curNode) {
          curNode = createFolderNode(pathParts[0]);
          newNode = curNode;
        }
        for (let j = 1; j < pathParts.length - 1; j++) {
          let subFolder: FolderNode | undefined = findFolderNode(curNode.children, pathParts[j]);
          if (!subFolder) {
            subFolder = createFolderNode(pathParts[j]);
            curNode.children.push(subFolder);
          }
          curNode = subFolder;
        }

        curNode.children.push(createFileNode(pathParts[pathParts.length - 1], file));
      } else {
        newNode = createFileNode(relPath, file);
      }

      if (newNode) {
        newNodes.push(newNode);
      }
    }
    this.flatNodeMap.clear();
    this.dataSource.data = newNodes;
  }

  hasChild(index: number, nodeData: FlatNode): boolean {
    return nodeData.expandable;
  }

  onClear(): void {
    this.readProgress.next(0);
    this.flatNodeMap.clear();
    this.dataSource.data = [];
  }

  onUpload(): void {
    const files = this.getSelectedFiles();
    if (!files || files.length === 0) {
      return;
    }

    const readProgress = this.readProgress;
    const loadedBytes: Map<File, number> = new Map<File, number>();
    const totalBytes = files.reduce((acc, file) => acc + file.size, 0);

    const updateProgress = () => {
      let totalLoaded = 0;
      for (const progress of loadedBytes.values()) {
        totalLoaded += progress;
      }

      const newProgress = totalLoaded / totalBytes * 100;
      console.log(newProgress);
      readProgress.next(newProgress);
    };

    const readFile = (file: File): Promise<ArrayBuffer> => new Promise<ArrayBuffer>((resolve, ignored) => {
        const reader = new FileReader();
        reader.onprogress = function(this: FileReader, ev: ProgressEvent): any {
          loadedBytes.set(file, ev.loaded);
          updateProgress();
          return;
        };

        reader.onloadend = function(this: FileReader, ignored2: ProgressEvent): any {
          console.log(`File ${file.name} load end`);
          resolve(reader.result as ArrayBuffer);
          return;
        };

        reader.readAsArrayBuffer(file);
      });

    readProgress.next(0);
    files.map(file => readFile(file));
  }

  onFolderSelectionToggle(flatNode: FlatNode) {
    this.selection.toggle(flatNode);
    const descendants = this.treeControl.getDescendants(flatNode);
    if (this.selection.isSelected(flatNode)) {
      this.selection.select(...descendants);
    } else {
      this.selection.deselect(...descendants);
    }
    descendants.every(child => this.selection.isSelected(child));
    this.validateParentsSelection(flatNode);
    this.updateSummary();
  }

  onFileSelectionToggle(flatNode: FlatNode) {
    this.selection.toggle(flatNode);
    this.validateParentsSelection(flatNode);
    this.updateSummary();
  }

  isAllDescendantsSelected(flatNode: FlatNode): boolean {
    return this.treeControl.getDescendants(flatNode).every(node => this.selection.isSelected(node));
  }

  isSomeDescendantsSelected(flatNode: FlatNode): boolean {
    const hasSelectedDescendants = this.treeControl.getDescendants(flatNode).some(node => this.selection.isSelected(node));
    return hasSelectedDescendants && !this.isAllDescendantsSelected(flatNode);
  }

  private transformer(node: Node, level: number): FlatNode {
    const flatNode = new FlatNode(node.name, level, node.type === 'folder');
    this.flatNodeMap.set(flatNode, node);
    return flatNode;
  }

  private validateParentsSelection(flatNode: FlatNode): void {
    let parent = this.getParentNode(flatNode);
    while (parent) {
      this.validateRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  private getParentNode(flatNode: FlatNode): FlatNode | undefined {
    const level = flatNode.level;
    if (level < 1) {
      return undefined;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(flatNode) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const node = this.treeControl.dataNodes[i];
      if (node.level < level) {
        return node;
      }
    }
    return undefined;
  }

  private validateRootNodeSelection(flatNode: FlatNode): void {
    const isSelected = this.selection.isSelected(flatNode);
    const isAllDescendantsSelected = this.isAllDescendantsSelected(flatNode);
    if (isSelected && !isAllDescendantsSelected) {
      this.selection.deselect(flatNode);
    } else if (!isSelected && isAllDescendantsSelected) {
      this.selection.select(flatNode);
    }
  }

  private getSelectedFiles(): File[] {
    const res = [];
    for (const flatNode of this.selection.selected) {
      const node = this.flatNodeMap.get(flatNode);
      if (node && node.type === 'file') {
        res.push(node.file);
      }
    }
    return res;
  }

  private updateSummary(): void {
    const selFiles = this.getSelectedFiles();
    this.summarySize = 0;
    for (const file of selFiles) {
      this.summarySize += file.size;
    }
  }
}
