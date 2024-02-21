// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract CryptoFresher is ERC721Burnable, Ownable {
    uint256 private _tokenIdTracker;
    mapping(address => uint256[]) ownedTokens;

    constructor() ERC721("CryptoFresher", "CFSH") Ownable(msg.sender) {}

    function mint(address to) public onlyOwner {
        _mintFresher(to);
    }

    function bulkMint(address to, uint256 amount) public onlyOwner {
        for (uint256 index = 0; index < amount; index++) {
            _mintFresher(to);
        }
    }

    function getOwnedTokens(
        address account
    ) public view returns (uint256[] memory tokenIds) {
        tokenIds = ownedTokens[account];
    }

    function _onwedTokensCount(
        address account
    ) private view returns (uint256 count) {
        count = ownedTokens[account].length;
    }

    function _mintFresher(address to) private {
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
            uint256 count = _onwedTokensCount(previousOwner);
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
}
