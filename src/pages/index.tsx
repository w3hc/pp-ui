import * as React from 'react'
import { Text, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { BrowserProvider, Contract, Eip1193Provider, parseEther } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../utils/erc20'
import { LinkComponent } from '../components/layout/LinkComponent'
import { ethers } from 'ethers'
import { Head } from '../components/layout/Head'
import { SITE_NAME, SITE_DESCRIPTION } from '../utils/config'
import { HeadingComponent } from '../components/layout/HeadingComponent'

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const provider: Eip1193Provider | undefined = walletProvider
  const toast = useToast()

  const getBal = async () => {
    if (isConnected) {
      const ethersProvider = new BrowserProvider(provider as any)
      const signer = await ethersProvider.getSigner()
      const balance = await ethersProvider.getBalance(address as any)
      const ethBalance = ethers.formatEther(balance)
      if (ethBalance !== '0') {
        return Number(ethBalance)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  const faucetTx = async () => {
    const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
    const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
    const specialSigner = new ethers.Wallet(pKey, customProvider)
    const tx = await specialSigner.sendTransaction({
      to: address,
      value: parseEther('0.0001'),
    })
    const receipt = await tx.wait(1)
    return receipt
  }

  const doSomething = async () => {
    try {
      if (!isConnected) {
        toast({
          title: 'Not connected yet',
          description: 'Please connect your wallet, my friend.',
          status: 'error',
          position: 'bottom',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        return
      }
      let signer
      if (provider) {
        setIsLoading(true)
        setTxHash('')
        setTxLink('')
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        ///// Send ETH if needed /////
        const bal = await getBal()
        console.log('bal:', bal)
        if (bal < 0.0001) {
          const faucet = await faucetTx()
          console.log('faucet tx', faucet)
        }

        ///// Call /////
        const erc20 = new Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)
        const call = await erc20.mint(parseEther('10000'))
        const receipt = await call.wait()

        console.log('tx:', receipt)
        setTxHash(receipt.hash)
        setTxLink('https://sepolia.etherscan.io/tx/' + receipt.hash)
        setIsLoading(false)
        toast({
          title: 'Successful tx',
          description: 'Well done! 🎉',
          status: 'success',
          position: 'bottom',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })
      }
    } catch (e) {
      setIsLoading(false)
      console.log('error:', e)
      toast({
        title: 'Woops',
        description: 'Something went wrong...',
        status: 'error',
        position: 'bottom',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head title={SITE_NAME} description={SITE_DESCRIPTION} />
      <main>
        <HeadingComponent as="h3">Project Description</HeadingComponent>

        <Text>
          The current state of Universal Profile (UP) showcases its impressive capabilities, which have significantly enhanced user experience and
          security. Despite its potential, UP&apos;s reach is constrained as it is not available on all blockchain networks. This limitation hinders
          many users and developers from leveraging its full benefits, thereby restricting its broader adoption and utility. To address this
          challenge, our project aims to port UP to multiple blockchain networks, ensuring it is compatible with ERC-4337 standards. By doing so, we
          will not only expand UP's accessibility but also enhance its interoperability across various platforms, fostering a more inclusive and
          versatile ecosystem.
        </Text>
        <br />
        <HeadingComponent as="h4">Features</HeadingComponent>
        <Text>
          One of the key features of our project is the ability for users to synchronize their Personal Profile (PP) key managers across multiple
          networks. This synchronization ensures that users can maintain their profiles seamlessly, regardless of the blockchain they are using.
          Additionally, our solution is designed to be extremely easy to integrate, either through an SDK or a package, reducing the complexity for
          developers and accelerating adoption. Another significant feature is the provision of a gasless experience, which eliminates the need for
          users to pay transaction fees in native tokens, thereby lowering barriers to entry and enhancing user convenience.
        </Text>
        <br />
        <HeadingComponent as="h4">Deliverables</HeadingComponent>
        <Text>
          The project will deliver several critical components to ensure its success and usability. Firstly, we will develop and deploy Solidity smart
          contracts that underpin the functionality of UP on various blockchains. Alongside the technical backend, we will create a user-friendly
          interface (UI) that allows users to interact with their profiles effortlessly. Comprehensive documentation will also be provided, detailing
          the implementation process, usage instructions, and troubleshooting tips, ensuring that developers and users can easily navigate and utilize
          the system.
        </Text>
        <br />

        <HeadingComponent as="h4">Key Benefits for Developers and Users</HeadingComponent>
        <Text>
          Our solution offers numerous benefits for both developers and users. For users, the primary advantage is the elimination of dependency on
          native tokens, as the gasless experience removes the need for transaction fees. This not only simplifies the user experience but also makes
          blockchain technology more accessible to a wider audience. For developers, the broad adoption of Linked Standard Profile (LSP) standards
          ensures a unified and consistent development framework, enhancing interoperability and reducing integration efforts. Furthermore, LUKSO will
          benefit from an alternative multichain relayer system, providing additional flexibility and resilience. Users will also appreciate the
          ability to utilize UP on various blockchains with the same address, ensuring a consistent experience similar to what is offered on Universal
          Profile Cloud.
        </Text>
        <br />
        <HeadingComponent as="h4"> Business Model</HeadingComponent>

        <Text>
          Our business model is designed to be flexible and scalable, catering to different user needs and preferences. We offer tiered pricing based
          on the number of destination chains selected, allowing users to choose the package that best suits their requirements. Additionally, our
          TopUP services provide premium features and enhancements for those seeking advanced capabilities. This model ensures that our solution is
          accessible to a broad audience while also offering specialized options for those with more complex needs.
        </Text>
        <br />
        <HeadingComponent as="h4">Perspective</HeadingComponent>
        <Text>
          Looking ahead, we envision extending our solution to non-Ethereum Virtual Machine (EVM) compatible blockchains, broadening the scope and
          applicability of UP. We also aim to incorporate passkeys and walletless experiences, further simplifying user interactions and enhancing
          security. Encouraging widespread adoption of our SDK is another key goal, as it will drive greater integration and usage across the
          blockchain ecosystem. Finally, we plan to develop a distributed and decentralized relayer system, which will improve the robustness and
          efficiency of our solution, ensuring it remains at the forefront of blockchain technology advancements.
        </Text>
        <br />
        <HeadingComponent as="h3">Technical Specifications</HeadingComponent>
        <br />
        <Text>
          Our project will deploy the Standard LSP23 to 42 different Ethereum Virtual Machine (EVM) compatible chains. This deployment will utilize
          Foundry and CREATE2, ensuring that the contracts are both secure and efficiently deployed across these networks. By leveraging CREATE2, we
          can precompute contract addresses, enhancing predictability and reliability. This widespread deployment guarantees that users can access the
          Universal Profile (UP) functionality across a broad spectrum of blockchain environments, fostering greater interoperability and usage.
        </Text>
        <br />
        <Text>
          A user-friendly interface (UI) will be developed to facilitate the creation of UPs via email using Single Sign-On (SSO). This approach
          simplifies the onboarding process, making it easy for users to create and manage their profiles without the need for complex blockchain
          interactions. The use of SSO ensures that users can leverage their existing email credentials, providing a familiar and secure method to
          access their UPs.
        </Text>
        <br />
        <Text>
          We will deploy or integrate backend relayers on 42 different EVM-compatible chains to handle transaction relaying. These relayers are
          crucial for enabling the gasless experience, as they abstract the complexity of transaction fees from the end user. By managing and
          subsidizing transaction costs, the relayers ensure smooth and seamless interactions with the blockchain, enhancing the overall user
          experience.
        </Text>
        <br />
        <Text>
          A comprehensive dashboard will be provided to manage subscriptions. This dashboard will allow users to oversee their service tiers, monitor
          usage, and make necessary adjustments to their subscriptions. It will be designed with user experience in mind, offering intuitive
          navigation and clear insights into the various features and benefits of each subscription tier.
        </Text>
        <br />
        <Text>
          Our infrastructure will include robust capabilities to track multi-chain events. This functionality is essential for maintaining consistency
          and coherence across different blockchain networks. By tracking events on multiple chains, we can ensure that user activities and profiles
          are synchronized accurately, providing a seamless experience no matter which blockchain they are interacting with. This multi-chain event
          tracking will also support analytics and reporting, offering valuable insights into user behavior and system performance.
        </Text>
        <br />
        <br />

        <HeadingComponent as="h3">How Portable Profile benefits the broader LUKSO ecosystem</HeadingComponent>
        <br />

        <HeadingComponent as="h4">Extend the Benefits of the Standards Offered by Lukso to the Whole Community</HeadingComponent>

        <Text>
          Our project aims to extend the benefits of the standards offered by Lukso to the entire blockchain community. By broadening the
          accessibility and applicability of these standards, we can foster a more inclusive and efficient ecosystem that leverages the strengths of
          Lukso's innovations.
        </Text>
        <br />

        <HeadingComponent as="h4">Showing the Whole Crypto Community the Relevance of These Standards</HeadingComponent>

        <Text>
          We are committed to demonstrating the relevance and importance of these standards to the entire crypto community. Through practical
          applications and widespread adoption, we will showcase how these standards can enhance security, interoperability, and user experience
          across various blockchain platforms.
        </Text>
        <br />

        <HeadingComponent as="h4">Best Solution for DApps Building on Lukso</HeadingComponent>

        <Text>
          Our project offers the best solution for decentralized applications (dApps) building on the Lukso blockchain. By providing robust tools,
          seamless integration, and comprehensive support, we enable developers to create innovative dApps that fully utilize Lukso&apos;s advanced
          features and standards.
        </Text>
        <br />

        <HeadingComponent as="h4">Gasless Experience in DApps on All Major Chains Using LSP Standards</HeadingComponent>

        <Text>
          We deliver a gasless experience in dApps across all major blockchain networks using Linked Standard Profile (LSP) standards. This approach
          removes the need for users to pay transaction fees, making blockchain interactions more accessible and user-friendly while maintaining high
          performance and security.
        </Text>
        <br />
        <HeadingComponent as="h3">Milestones</HeadingComponent>
        <br />

        <HeadingComponent as="h4">Milestone #1</HeadingComponent>

        <Text>
          Our first milestone focuses on developing the Minimum Viable Product (MVP), specifically the core smart contracts. These contracts will
          initially be deployed on three Ethereum Virtual Machine (EVM) compatible chains: CELO, Optimism, and Arthera. These chains are chosen for
          their focus on Regenerative Finance (ReFi) and their unique benefits to the ecosystem.
        </Text>
        <br />

        <Text>
          Additionally, we will deploy a relayer system on these three EVM chains to facilitate seamless transaction processing. This milestone also
          includes the creation of a simple, user-friendly interface (UI) to interact with the MVP.
        </Text>
        <br />

        <Text>
          During this phase, we will conduct research and development (R&D) to leverage the knowledge gained from working with these three EVM chains.
          This will help us plan for scaling the solution to 42 chains and ensure effective maintenance.
        </Text>
        <br />

        <HeadingComponent as="h4">Milestone #2</HeadingComponent>

        <Text>
          The second milestone expands the scope of our project by enhancing the contracts and UI to support 42 EVM-compatible chains. This involves
          deploying or integrating relayers on all 42 chains to ensure comprehensive coverage and functionality.
        </Text>
        <br />

        <Text>
          A significant deliverable in this milestone is the development of a dashboard. This dashboard will provide users with the ability to manage
          their subscriptions, monitor their usage, and interact with the UP system across multiple chains.
        </Text>
        <br />

        <HeadingComponent as="h4">Milestone #3</HeadingComponent>

        <Text>
          In the third milestone, we will implement an end-to-end key managers synchronization system. This system will enable users to synchronize
          their keys seamlessly across multiple networks, enhancing usability and security.
        </Text>
        <br />

        <Text>
          We will conduct extensive alpha testing and iterative improvements based on user feedback and performance data. This iterative approach
          ensures that we refine and enhance the system continuously.
        </Text>
        <br />

        <Text>
          Additionally, we will introduce an alpha version of the payment system, supporting both fiat and token transactions. This will provide users
          with flexible payment options and further streamline the user experience.
        </Text>
        <br />

        {/* <Button
          // mt={7}
          colorScheme="blue"
          variant="outline"
          type="submit"
          onClick={doSomething}
          isLoading={isLoading}
          loadingText="Minting..."
          spinnerPlacement="end">
          Mint
        </Button>
        {txHash && (
          <Text py={4} fontSize="14px" color="#45a2f8">
            <LinkComponent href={txLink ? txLink : ''}>{txHash}</LinkComponent>
          </Text>
        )} */}
      </main>
    </>
  )
}
