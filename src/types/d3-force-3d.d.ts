declare module 'd3-force-3d' {
  declare function forceLink(): D3Force3D.ForceLinkInstance;

  declare namespace D3Force3D {
    interface GraphEntity {
      id: string;
    }

    interface GraphLink extends GraphEntity {
      type: string;
      source: string | GraphNode;
      target: string | GraphNode;
    }

    interface ForceLinkInstance {
      (links: any[]): ForceLinkInstance;
      strength: (link: any) => ForceLinkInstance;
    }
  }
}
