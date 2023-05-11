export declare type DeployedContracts = {
    [contractName: string]: {
        address: string;
    };
};
export declare type DeploymentInfo = {
    [chainId: string]: DeployedContracts;
};
export declare function createDeploymentInfo(root: string): DeploymentInfo;
export declare function generateDeploymentInfo(): void;
