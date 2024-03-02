// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract CryptoFresher is ERC721Burnable, Ownable, AccessControl {
    uint256 private _tokenIdTracker;
    mapping(address => uint256[]) ownedTokens;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("CryptoFresher", "CFSH") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    modifier mustHaveMinterRole() {
        require(hasRole(MINTER_ROLE, msg.sender), "You must have the minter role");
        _;
    }

    function mint(address to) public mustHaveMinterRole {
        _mintFresherNFT(to);
    }

    function bulkMint(address to, uint256 amount) public mustHaveMinterRole {
        for (uint256 index = 0; index < amount; index++) {
            _mintFresherNFT(to);
        }
    }

    function getOwnedTokens(
        address account
    ) public view returns (uint256[] memory tokenIds) {
        tokenIds = ownedTokens[account];
    }

    function grantMinterRole(address account) public onlyOwner() {
        grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public onlyOwner() {
        revokeRole(MINTER_ROLE, account);
    }

    function _mintFresherNFT(address to) private {
        _mint(to, _tokenIdTracker);
        _tokenIdTracker++;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if (previousOwner != address(0)) {
            uint256 count = ownedTokens[previousOwner].length;
            uint256[] memory newOwnedTokens = new uint256[](count - 1);
            uint256 j = 0;

            for (uint256 i = 0; i < ownedTokens[previousOwner].length; i++) {
                if (ownedTokens[previousOwner][i] != tokenId) {
                    newOwnedTokens[j] = ownedTokens[previousOwner][i];
                    j++;
                }
            }

            ownedTokens[previousOwner] = newOwnedTokens;
        }

        if (to != address(0)) {
            ownedTokens[to].push(tokenId);
        }

        return previousOwner;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
