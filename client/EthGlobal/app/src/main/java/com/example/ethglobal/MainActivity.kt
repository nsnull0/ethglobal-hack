package com.example.ethglobal

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import com.example.ethglobal.databinding.ActivityMainBinding
import org.web3j.abi.FunctionEncoder
import org.web3j.abi.FunctionReturnDecoder
import org.web3j.abi.TypeReference
import org.web3j.abi.datatypes.*
import org.web3j.abi.datatypes.Function
import org.web3j.abi.datatypes.generated.Int256
import org.web3j.crypto.Credentials
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameterName
import org.web3j.protocol.core.methods.request.Transaction
import org.web3j.protocol.http.HttpService
import org.web3j.tx.RawTransactionManager
import org.web3j.tx.gas.ContractGasProvider
import org.web3j.tx.gas.DefaultGasProvider
import java.math.BigInteger

data class Network(
    val position: Int,
    val id: Long,
    val url: String,
    val address: String
)

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private lateinit var activities: List<Any?>
    private lateinit var web3j: Web3j
    private lateinit var credentials: Credentials
    private val networks = listOf(
        Network(
            position = 0,
            id = 44787,
            url = "https://alfajores-forno.celo-testnet.org",
            address = "0xDDa93C1F5730a6bD8088BC31b1B93E8DFba64bCB"
        ),
        Network(
            position = 1,
            id = 59140,
            url = "https://rpc.goerli.linea.build",
            address = "0x7Fb7989D17DA0186A2B3B78642cdbE330474604b"
        ),
        Network(
            position = 2,
            id = 97,
            url = "https://data-seed-prebsc-1-s1.binance.org:8545",
            address = "0xecF4c816D1cb7E20A9C7f6c83141763a34871FC5"
        )
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val navController = findNavController(R.id.nav_host_fragment_content_main)
        appBarConfiguration = AppBarConfiguration(navController.graph)
//        setupActionBarWithNavController(navController, appBarConfiguration)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration)
                || super.onSupportNavigateUp()
    }

    fun getActivities(pos: Int, privateKey: String): List<String> {
        credentials = Credentials.create(privateKey)
        val network = networks.first { it.position == pos }
        web3j = Web3j.build(HttpService(network.url))
        val transactionManager = RawTransactionManager(web3j, credentials, network.id)
        val contractGasProvider: ContractGasProvider = DefaultGasProvider()
        val activityPool = Contracts_ActivityPool_sol_ActivityPool.load(
            network.address,
            web3j,
            transactionManager,
            contractGasProvider
        )
        activities = activityPool.listOfActivity.sendAsync().get().toList()
        if (activities.isEmpty()) return emptyList()
        val result = List(activities.size) { index ->
            getActivityName(index)
        }
        return result
    }

    fun getActivityName(pos: Int): String {
        val inputParameters: List<Type<*>> = emptyList()
        val outputParameters: List<TypeReference<*>> = listOf(object : TypeReference<Utf8String>() {})
        val function = Function("getActivityName", inputParameters, outputParameters)
        val encodedFunction = FunctionEncoder.encode(function)
        val response = web3j.ethCall(
            Transaction.createEthCallTransaction(
                credentials.address,
                activities[pos].toString(),
                encodedFunction
            ), DefaultBlockParameterName.LATEST
        ).sendAsync().get()
        val result = FunctionReturnDecoder.decode(response.value, function.outputParameters)
        return result.first().toString()
    }

    fun getPrice(pos: Int): Int {
        val inputParameters: List<Type<*>> = emptyList()
        val outputParameters: List<TypeReference<*>> = listOf(object : TypeReference<Int256>() {})
        val function = Function("getPrice", inputParameters, outputParameters)
        val encodedFunction = FunctionEncoder.encode(function)
        val response = web3j.ethCall(
            Transaction.createEthCallTransaction(
                credentials.address,
                activities[pos].toString(),
                encodedFunction
            ), DefaultBlockParameterName.LATEST
        ).sendAsync().get()
        val result = FunctionReturnDecoder.decode(response.value, function.outputParameters)
        return BigInteger(result.first().value.toString()).toInt()
    }

    fun getPaymentTokenAddress(pos: Int): String {
        val inputParameters: List<Type<*>> = emptyList()
        val outputParameters: List<TypeReference<*>> = listOf(object : TypeReference<Address>() {})
        val function = Function("getPaymentTokenAddress", inputParameters, outputParameters)
        val encodedFunction = FunctionEncoder.encode(function)
        val response = web3j.ethCall(
            Transaction.createEthCallTransaction(
                credentials.address,
                activities[pos].toString(),
                encodedFunction
            ), DefaultBlockParameterName.LATEST
        ).sendAsync().get()
        val result = FunctionReturnDecoder.decode(response.value, function.outputParameters)
        return result.first().toString()
    }

    fun getCheckInStatus(pos: Int): Boolean {
        val inputParameters: List<Type<*>> = emptyList()
        val outputParameters: List<TypeReference<*>> = listOf(object : TypeReference<Bool>() {})
        val function = Function("getCheckInStatus", inputParameters, outputParameters)
        val encodedFunction = FunctionEncoder.encode(function)
        val response = web3j.ethCall(
            Transaction.createEthCallTransaction(
                credentials.address,
                activities[pos].toString(),
                encodedFunction
            ), DefaultBlockParameterName.LATEST
        ).sendAsync().get()
        val result = FunctionReturnDecoder.decode(response.value, function.outputParameters)
        return result.first().value as Boolean
    }

    fun subscribeThisActivity(pos: Int, value: String) {
        val inputParameters: List<Type<String>> = listOf(Utf8String(value))
        val outputParameters: List<TypeReference<*>> = emptyList()
        val function = Function("subscribeThisActivity", inputParameters, outputParameters)
        val encodedFunction = FunctionEncoder.encode(function)

        val response = web3j.ethSendTransaction(
            Transaction.createEthCallTransaction(
                credentials.address,
                activities[pos].toString(),
                encodedFunction
            )
        ).sendAsync().get()
        val transactionHash = response.transactionHash
        println()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 42 && resultCode == RESULT_OK) {
            (supportFragmentManager.findFragmentById(R.id.ScanFragment) as ScanFragment).startCamera()
        }
    }
}